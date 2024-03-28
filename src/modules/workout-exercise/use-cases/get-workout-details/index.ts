import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GetWorkoutExerciseDetailsParamsDto } from '~/modules/workout-exercise/dto/get-workout-exercise-details.dto';
import { WorkoutExerciseDto } from '~/modules/workout-exercise/dto/workout-exercise.dto';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import { UseCase } from '~/shared/core/use-case';

type GetWorkoutExerciseParams = GetWorkoutExerciseDetailsParamsDto & {
  userId: string;
};
type GetWorkoutExerciseResult = Promise<WorkoutExerciseDto>;

@Injectable()
export class GetWorkoutExerciseDetails
  implements UseCase<GetWorkoutExerciseParams, GetWorkoutExerciseResult>
{
  constructor(
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
  ) {}

  async execute({
    userId,
    id,
  }: GetWorkoutExerciseParams): GetWorkoutExerciseResult {
    const workoutExercise =
      await this.workoutExerciseRepository.findOneByIdWithRelations({
        id,
        relations: ['workout', 'sets'],
      });

    if (!workoutExercise?.workoutDomain) {
      throw new HttpException(
        WorkoutExerciseUseCaseError.messages.workoutExerciseNotFound(id),
        HttpStatus.NOT_FOUND,
      );
    }

    const canAccess =
      workoutExercise.workoutDomain.userId === userId ||
      !workoutExercise.workoutDomain.privateStatus.isPrivate();
    if (!canAccess) {
      throw new ForbiddenException(
        WorkoutExerciseUseCaseError.messages.cannotAccessOthersWorkoutExercise,
      );
    }

    const workoutExerciseDto = workoutExercise.toDetailsDto();
    if (workoutExerciseDto.isLeft()) {
      throw new HttpException(
        { message: workoutExerciseDto.value.message },
        workoutExerciseDto.value.code,
      );
    }

    return workoutExerciseDto.value;
  }
}
