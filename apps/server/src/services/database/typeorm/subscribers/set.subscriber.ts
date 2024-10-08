import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Set } from '~/modules/set/entities/set.entity';

type MaxOrderQueryResult = { maxOrder: number | null };

@EventSubscriber()
export class SetSubscriber implements EntitySubscriberInterface<Set> {
  listenTo() {
    return Set;
  }

  async beforeInsert({ entity, manager }: InsertEvent<Set>) {
    if (entity.order !== null) {
      return entity;
    }

    const queryResult = await manager
      .createQueryBuilder(Set, 'set')
      .select('MAX(set.order)', 'maxOrder')
      .where('set.workoutExerciseId = :workoutExerciseId', {
        workoutExerciseId: entity.workoutExerciseId,
      })
      .getRawOne<MaxOrderQueryResult>();

    const maxOrder = queryResult?.maxOrder ?? null;
    entity.order = maxOrder !== null ? maxOrder + 1 : 0;
  }
}
