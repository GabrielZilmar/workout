import { Injectable } from '@nestjs/common';
import SetDomain from '~/modules/set/domain/set.domain';
import { Set } from '~/modules/set/entities/set.entity';
import SetMapper from '~/modules/set/mappers/set.mapper';
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
      .select('set')
      .from(Set, 'set')
      .leftJoin('set.workoutExercise', 'we')
      .leftJoin('we.workout', 'w')
      .where('we.id = :workoutExerciseId', {
        workoutExerciseId,
      })
      .andWhere('(w.userId = :userId OR w.isPrivate = false)', { userId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const itemsToDomain: SetDomain[] = [];
    for await (const item of items) {
      const itemToDomain = this.mapper.toDomain(item);

      if (itemToDomain.isRight()) {
        itemsToDomain.push(itemToDomain.value);
      }
    }

    return { items: itemsToDomain, count };
  }
}
