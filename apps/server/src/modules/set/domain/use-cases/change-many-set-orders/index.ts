import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import { ChangeManySetOrdersBodyDTO } from '~/modules/set/dto/change-many-set-orders.dto';
import { Set } from '~/modules/set/entities/set.entity';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { UseCase } from '~/shared/core/use-case';

type ChangeManySetOrdersParams = ChangeManySetOrdersBodyDTO & {
  userId: string;
};
type ChangeManySetOrdersResult = Promise<boolean>;

@Injectable()
export class ChangeManySetOrders
  implements UseCase<ChangeManySetOrdersParams, ChangeManySetOrdersResult>
{
  constructor(private readonly dataSource: DataSource) {}

  async execute({
    userId,
    items,
  }: ChangeManySetOrdersParams): Promise<ChangeManySetOrdersResult> {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const setRepository = transactionalEntityManager.getRepository(Set);

        await Promise.all(
          items.map(async ({ id, order }) => {
            const set = await setRepository.findOne({
              where: { id },
              relations: ['workoutExercise', 'workoutExercise.workout'],
            });
            if (!set) {
              throw new NotFoundException(
                SetUseCaseError.messages.setNotFound(id),
              );
            }

            if (set.workoutExercise.workout.userId !== userId) {
              throw new ForbiddenException(
                SetUseCaseError.messages.cannotUpdateOthersWorkout,
              );
            }

            const updatedSet = await setRepository.update(id, { order });
            if (!updatedSet.affected) {
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
