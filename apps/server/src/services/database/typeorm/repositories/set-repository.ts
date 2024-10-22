import { Injectable } from '@nestjs/common';
import SetDomain from '~/modules/set/domain/set.domain';
import { Set } from '~/modules/set/entities/set.entity';
import SetMapper from '~/modules/set/mappers/set.mapper';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import { Workout } from '~/modules/workout/entities/workout.entity';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';

const DEFAULT_TAKE_ITEMS = 10;
const DEFAULT_SKIP_ITEMS = 0;

type FindByWorkoutExerciseWhereOptions = {
  userId: string;
  workoutExerciseId: string;
};
type FindByWorkoutExerciseIdParams = {
  where: FindByWorkoutExerciseWhereOptions;
  skip?: number;
  take?: number;
};
type FindByWorkoutExerciseIdResult = Promise<{
  items: SetDomain[];
  count: number;
}>;
type FindProgressHistoryParams = {
  exerciseId: string;
  userId: string;
  startDate?: string;
  endDate?: string;
};

@Injectable()
export default class SetRepository extends BaseRepository<Set, SetDomain> {
  mapper: SetMapper;

  constructor(setMapper: SetMapper) {
    super(Set, setMapper);
  }

  async findByWorkoutExerciseId({
    where: { userId, workoutExerciseId },
    skip = DEFAULT_SKIP_ITEMS,
    take = DEFAULT_TAKE_ITEMS,
  }: FindByWorkoutExerciseIdParams): FindByWorkoutExerciseIdResult {
    const [items, count] = await this.repository
      .createQueryBuilder()
      .select('Set')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('id')
          .from(WorkoutExercise, 'we')
          .where('we.id = :workoutExerciseId', {
            workoutExerciseId,
          })
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select('id')
              .from(Workout, 'w')
              .where('w.id = we.workoutId')
              .andWhere('(w.userId = :userId OR w.isPrivate = false)', {
                userId,
              })
              .getQuery();

            return `(we.workoutId) IN ${subQuery}`;
          })
          .getQuery();

        return `(Set.workoutExerciseId) IN ${subQuery}`;
      })
      .groupBy('Set.id')
      .skip(skip)
      .take(take)
      .orderBy('Set.order', 'ASC')
      .getManyAndCount();

    const itemsToDomain: SetDomain[] = [];
    for (const item of items) {
      const itemToDomain = await this.mapper.toDomain(item);

      if (itemToDomain.isRight()) {
        itemsToDomain.push(itemToDomain.value);
      }
    }

    return { items: itemsToDomain, count };
  }

  async findProgressHistory({
    exerciseId,
    userId,
    startDate,
    endDate,
  }: FindProgressHistoryParams) {
    const query = this.repository
      .createQueryBuilder('set')
      .leftJoin('set.workoutExercise', 'we')
      .leftJoin('we.workout', 'w')
      .innerJoin(
        (qb) =>
          qb
            .subQuery()
            .select('MAX(setSub.weight)', 'maxWeight')
            .addSelect('DATE(setSub.createdAt)', 'createdDate')
            .from(Set, 'setSub')
            .leftJoin('setSub.workoutExercise', 'weSub')
            .leftJoin('weSub.workout', 'wSub')
            .where('weSub.exerciseId = :exerciseId')
            .andWhere('wSub.userId = :userId')
            .groupBy('DATE(setSub.createdAt)'),
        'maxWeightSub',
        '"maxWeightSub"."createdDate" = DATE(set.createdAt) AND "maxWeightSub"."maxWeight" = set.weight',
      )
      .where('we.exerciseId = :exerciseId', { exerciseId })
      .andWhere('w.userId = :userId', { userId });
    if (startDate) {
      query.andWhere('DATE(set.createdAt) >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('DATE(set.createdAt) <= :endDate', { endDate });
    }
    const items = await query.getMany();

    const itemsToDomain: SetDomain[] = [];
    for (const item of items) {
      const itemToDomain = await this.mapper.toDomain(item);

      if (itemToDomain.isRight()) {
        itemsToDomain.push(itemToDomain.value);
      }
    }
    return itemsToDomain;
  }
}
