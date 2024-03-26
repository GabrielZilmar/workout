import { Injectable } from '@nestjs/common';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';

const DEFAULT_TAKE_ITEMS = 20;
const DEFAULT_SKIP_ITEMS = 0;

type UsersWorkoutExercisesWhereOption = {
  userId: string;
  workoutId: string;
};
type UsersWorkoutExercisesFindParams = {
  where: UsersWorkoutExercisesWhereOption;
  skip?: number;
  take?: number;
};
type UsersWorkoutExerciseFindResult = {
  items: WorkoutExerciseDomain[];
  count: number;
};

type FindOneByIdRelationsParams = 'workout' | 'exercise';
type FindOneByIdParams = {
  id: string;
  relations?: FindOneByIdRelationsParams[];
};
type FindOneByIdResult = Promise<WorkoutExerciseDomain | null>;

@Injectable()
export default class WorkoutExerciseRepository extends BaseRepository<
  WorkoutExercise,
  WorkoutExerciseDomain
> {
  mapper: WorkoutExerciseMapper;

  constructor(workoutExerciseMapper: WorkoutExerciseMapper) {
    super(WorkoutExercise, workoutExerciseMapper);
  }

  async findUsersWorkoutExercises({
    where: { userId, workoutId },
    take = DEFAULT_TAKE_ITEMS,
    skip = DEFAULT_SKIP_ITEMS,
  }: UsersWorkoutExercisesFindParams): Promise<UsersWorkoutExerciseFindResult> {
    const [items, count] = await this.repository
      .createQueryBuilder()
      .select('we')
      .from(WorkoutExercise, 'we')
      .leftJoin('we.workout', 'w')
      .where('we.workoutId = :workoutId', { workoutId })
      .andWhere('(w.userId = :userId OR w.isPrivate = false)', { userId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const itemsToDomain: WorkoutExerciseDomain[] = [];
    for await (const item of items) {
      const itemToDomain = this.mapper.toDomain(item);

      if (itemToDomain.isRight()) {
        itemsToDomain.push(itemToDomain.value);
      }
    }

    return { items: itemsToDomain, count };
  }

  async findOneByIdWithRelations({
    id,
    relations = [],
  }: FindOneByIdParams): FindOneByIdResult {
    const item = await this.repository.findOne({
      where: { id },
      relations,
    });
    if (!item) {
      return null;
    }

    const itemToDomain = this.mapper.toDomain(item);
    return itemToDomain.isRight() ? itemToDomain.value : null;
  }
}
