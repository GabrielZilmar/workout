import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DeleteWorkoutExerciseDto } from '~/modules/workout-exercise/dto/delete-workout-exercise.dto';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

type DeleteWorkoutExerciseParams = DeleteWorkoutExerciseDto & {
  userId: string;
};
type DeleteWorkoutResult = Promise<boolean>;

@Injectable()
export default class DeleteWorkoutExercise
  implements UseCase<DeleteWorkoutExerciseParams, DeleteWorkoutResult>
{
  constructor(
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  public async execute({
    id,
    userId,
  }: DeleteWorkoutExerciseParams): DeleteWorkoutResult {
    const workoutExercise =
      await this.workoutExerciseRepository.findOneByIdWithRelations({
        id,
        relations: ['workout'],
      });
    if (!workoutExercise) {
      throw new HttpException(
        WorkoutExerciseUseCaseError.messages.workoutExerciseNotFound(id),
        HttpStatus.NOT_FOUND,
      );
    }

    const canDelete = workoutExercise.workoutDomain?.userId === userId;
    if (!canDelete) {
      throw new ForbiddenException(
        WorkoutExerciseUseCaseError.messages.cannotDeleteOthersWorkoutExercise,
      );
    }

    const workoutExerciseHasBeenDeleted =
      await this.workoutExerciseRepository.delete(id);
    if (workoutExerciseHasBeenDeleted.isLeft()) {
      throw new HttpException(
        {
          message: workoutExerciseHasBeenDeleted.value.message,
        },
        workoutExerciseHasBeenDeleted.value.code,
      );
    }

    return true;
  }
}
