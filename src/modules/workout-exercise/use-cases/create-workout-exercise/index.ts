import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { CreateWorkoutExerciseDto } from '~/modules/workout-exercise/dto/create-workout-exercise.dto';
import { WorkoutExerciseDto } from '~/modules/workout-exercise/dto/workout-exercise.dto';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

type CreateWorkoutExerciseParams = CreateWorkoutExerciseDto & {
  userId: string;
};
type CreateWorkoutExerciseResult = Promise<WorkoutExerciseDto>;

@Injectable()
export class CreateWorkoutExercise
  implements UseCase<CreateWorkoutExerciseParams, CreateWorkoutExerciseResult>
{
  constructor(
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
    private readonly workoutRepository: WorkoutRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly workoutExerciseMapper: WorkoutExerciseMapper,
  ) {}

  async execute({
    workoutId,
    exerciseId,
    order,
    userId,
  }: CreateWorkoutExerciseParams): CreateWorkoutExerciseResult {
    const workoutExerciseDomainOrError = WorkoutExerciseDomain.create({
      workoutId,
      exerciseId,
      order,
    });

    if (workoutExerciseDomainOrError.isLeft()) {
      throw new HttpException(
        { message: workoutExerciseDomainOrError.value.message },
        workoutExerciseDomainOrError.value.code,
      );
    }

    // Todo: Create a pipe for Workout and Exercise checks
    const workoutExists = await this.workoutRepository.findOneById(workoutId);
    if (!workoutExists) {
      throw new NotFoundException({
        message:
          WorkoutExerciseUseCaseError.messages.workoutNotFound(workoutId),
      });
    }
    if (workoutExists.userId !== userId) {
      throw new ForbiddenException({
        message:
          WorkoutExerciseUseCaseError.messages.workoutNotBelongToUser(
            workoutId,
          ),
      });
    }

    const exerciseExists = await this.exerciseRepository.findOneById(
      exerciseId,
    );
    if (!exerciseExists) {
      throw new NotFoundException({
        message:
          WorkoutExerciseUseCaseError.messages.exerciseNotFound(exerciseId),
      });
    }

    const workoutExerciseCreatedOrError =
      await this.workoutExerciseRepository.create(
        this.workoutExerciseMapper.toPersistence(
          workoutExerciseDomainOrError.value,
        ),
      );
    if (workoutExerciseCreatedOrError.isLeft()) {
      throw new HttpException(
        { message: workoutExerciseCreatedOrError.value.message },
        workoutExerciseCreatedOrError.value.code,
      );
    }

    const workoutExerciseDtoOrError =
      workoutExerciseCreatedOrError.value.toDto();
    if (workoutExerciseDtoOrError.isLeft()) {
      throw new HttpException(
        { message: workoutExerciseDtoOrError.value.message },
        workoutExerciseDtoOrError.value.code,
      );
    }

    return workoutExerciseDtoOrError.value;
  }
}
