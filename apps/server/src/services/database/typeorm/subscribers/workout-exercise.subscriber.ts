import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';

type MaxOrderQueryResult = { maxOrder: number | null };

@EventSubscriber()
export class WorkoutExerciseSubscriber
  implements EntitySubscriberInterface<WorkoutExercise>
{
  listenTo() {
    return WorkoutExercise;
  }

  async beforeInsert({ entity, manager }: InsertEvent<WorkoutExercise>) {
    if (entity.order !== null) {
      return entity;
    }

    const queryResult = await manager
      .createQueryBuilder(WorkoutExercise, 'we')
      .select('MAX(we.order)', 'maxOrder')
      .where('we.workoutId = :workoutId', { workoutId: entity.workoutId })
      .getRawOne<MaxOrderQueryResult>();

    const maxOrder = queryResult?.maxOrder ?? null;
    entity.order = maxOrder !== null ? maxOrder + 1 : 0;
  }
}
