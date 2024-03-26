import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UpdateWorkoutExerciseDto,
  UpdateWorkoutExerciseParamsDto,
} from '~/modules/workout-exercise/dto/update-workout-exercise.dto';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

type UpdateWorkoutParams = UpdateWorkoutExerciseDto &
  UpdateWorkoutExerciseParamsDto & { userId: string };
type UpdateWorkoutResult = Promise<boolean>;

@Injectable()
export class UpdateWorkoutExercise
  implements UseCase<UpdateWorkoutParams, UpdateWorkoutResult>
{
  constructor(
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
    private readonly workoutRepository: WorkoutRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly workoutExerciseMapper: WorkoutExerciseMapper,
  ) {}

  async execute({
    id,
    userId,
    workoutId,
    exerciseId,
    ...params
  }: UpdateWorkoutParams): UpdateWorkoutResult {
    const workoutExercise = await this.workoutExerciseRepository.findOneById(
      id,
    );
    if (!workoutExercise) {
      throw new NotFoundException(
        WorkoutExerciseUseCaseError.messages.workoutExerciseNotFound(id),
      );
    }

    if (workoutId && workoutExercise.workoutId !== workoutId) {
      const workoutExists = await this.workoutRepository.findOneById(workoutId);
      if (!workoutExists) {
        throw new NotFoundException(
          WorkoutExerciseUseCaseError.messages.workoutNotFound(workoutId),
        );
      }

      if (workoutExists.userId !== userId) {
        throw new ForbiddenException({
          message:
            WorkoutExerciseUseCaseError.messages.workoutNotBelongToUser(
              workoutId,
            ),
        });
      }
    }

    if (exerciseId && workoutExercise.exerciseId !== exerciseId) {
      const exerciseExists = await this.exerciseRepository.findOneById(
        exerciseId,
      );
      if (!exerciseExists) {
        throw new NotFoundException(
          WorkoutExerciseUseCaseError.messages.exerciseNotFound(exerciseId),
        );
      }
    }

    const workoutExerciseDomainUpdatedOrError = workoutExercise.update({
      workoutId,
      exerciseId,
      ...params,
    });
    if (workoutExerciseDomainUpdatedOrError.isLeft()) {
      throw new HttpException(
        {
          message: workoutExerciseDomainUpdatedOrError.value.message,
        },
        workoutExerciseDomainUpdatedOrError.value.code,
      );
    }

    const workoutExerciseData = this.workoutExerciseMapper.toPersistence(
      workoutExerciseDomainUpdatedOrError.value,
    );
    const workoutExerciseUpdatedOrError =
      await this.workoutExerciseRepository.update(id, {
        ...workoutExerciseData,
      });
    if (workoutExerciseUpdatedOrError.isLeft()) {
      throw new HttpException(
        {
          message: workoutExerciseUpdatedOrError.value.message,
        },
        workoutExerciseUpdatedOrError.value.code,
      );
    }

    return true;
  }
}
