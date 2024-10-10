import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChangeWorkoutExerciseOrdersBodyDTO } from '~/modules/workout-exercise/dto/change-workout-exercises-orders.dto';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { UseCase } from '~/shared/core/use-case';

type ChangeWorkoutExercisesOrdersParams = ChangeWorkoutExerciseOrdersBodyDTO & {
  userId: string;
};
type ChangeWorkoutExercisesOrdersResult = Promise<boolean>;

@Injectable()
export class ChangeWorkoutExercisesOrders
  implements
    UseCase<
      ChangeWorkoutExercisesOrdersParams,
      ChangeWorkoutExercisesOrdersResult
    >
{
  constructor(private readonly dataSource: DataSource) {}

  async execute({
    userId,
    items,
  }: ChangeWorkoutExercisesOrdersParams): Promise<ChangeWorkoutExercisesOrdersResult> {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const workoutExerciseRepository =
          transactionalEntityManager.getRepository(WorkoutExercise);

        await Promise.all(
          items.map(async ({ id, order }) => {
            const workoutExercise = await workoutExerciseRepository.findOne({
              where: { id },
              relations: ['workout'],
            });
            if (!workoutExercise) {
              throw new NotFoundException(
                WorkoutUseCaseError.messages.workoutNotFound(id),
              );
            }

            if (workoutExercise.workout.userId !== userId) {
              throw new ForbiddenException(
                WorkoutUseCaseError.messages.cannotUpdateOthersWorkout,
              );
            }

            const updatedWorkoutExercise =
              await workoutExerciseRepository.update(id, { order });
            if (!updatedWorkoutExercise.affected) {
              throw new InternalServerErrorException({
                message: RepositoryError.messages.updateError,
              });
            }
          }),
        );
      },
    );

    return true;
  }
}
