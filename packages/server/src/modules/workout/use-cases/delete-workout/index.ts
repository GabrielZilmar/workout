import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import DeleteWorkoutDto from '~/modules/workout/dto/delete-workout.dto';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

type DeleteWorkoutParams = DeleteWorkoutDto & { userId: string };
type DeleteWorkoutResult = Promise<boolean>;

@Injectable()
export default class DeleteWorkout
  implements UseCase<DeleteWorkoutParams, DeleteWorkoutResult>
{
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  public async execute({
    id,
    userId,
  }: DeleteWorkoutParams): DeleteWorkoutResult {
    const workout = await this.workoutRepository.findOneById(id);
    if (!workout) {
      throw new HttpException(
        WorkoutUseCaseError.messages.workoutNotFound(id),
        HttpStatus.NOT_FOUND,
      );
    }

    const canDelete = workout.userId === userId;
    if (!canDelete) {
      throw new ForbiddenException(
        WorkoutUseCaseError.messages.cannotDeleteOthersWorkout,
      );
    }

    const workoutHasBeenDeleted = await this.workoutRepository.delete(id);
    if (workoutHasBeenDeleted.isLeft()) {
      throw new HttpException(
        {
          message: workoutHasBeenDeleted.value.message,
        },
        workoutHasBeenDeleted.value.code,
      );
    }

    return true;
  }
}
