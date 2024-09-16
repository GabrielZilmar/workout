import { HttpStatus, Injectable } from '@nestjs/common';
import { Brackets, DeepPartial } from 'typeorm';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { Workout } from '~/modules/workout/entities/workout.entity';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { Either, left, right } from '~/shared/either';

type DuplicatedItems = { userId?: string; name?: string };

type PreventDuplicatedParams = DuplicatedItems & {
  id?: string;
};

type FindPublicWorkoutsParams = {
  searchTerm?: string;
  skip?: number;
  take?: number;
};

@Injectable()
export default class WorkoutRepository extends BaseRepository<
  Workout,
  WorkoutDomain
> {
  mapper: WorkoutMapper;

  constructor(workoutMapper: WorkoutMapper) {
    super(Workout, workoutMapper);
  }

  private async preventDuplicatedUser({
    id,
    userId,
    name,
  }: PreventDuplicatedParams): Promise<Either<RepositoryError, boolean>> {
    const itemExist = await this.findOne({
      where: [{ userId, name }],
    });

    if (itemExist) {
      const isSameUser = itemExist.id?.toValue() === id;
      if (isSameUser) {
        return right(true);
      }

      return left(
        RepositoryError.create(
          RepositoryError.messages.itemDuplicated,
          { name, userId },
          HttpStatus.CONFLICT,
        ),
      );
    }

    return right(true);
  }

  public async create(
    item: DeepPartial<Workout>,
  ): Promise<Either<RepositoryError, WorkoutDomain>> {
    const { id, name, userId } = item;

    const isDuplicated = await this.preventDuplicatedUser({
      id: id?.toString(),
      userId,
      name: name,
    });

    if (isDuplicated.isLeft()) {
      return left(isDuplicated.value);
    }

    try {
      const newWorkout = await this.repository.save(item);
      const newWorkoutDomain = await this.mapper.toDomain(newWorkout);

      return newWorkoutDomain;
    } catch (err) {
      return left(RepositoryError.create((err as Error).message));
    }
  }

  public async findPublicWorkouts({
    searchTerm,
    skip,
    take,
  }: FindPublicWorkoutsParams): Promise<
    Promise<{ items: WorkoutDomain[]; count: number }>
  > {
    const qb = this.repository
      .createQueryBuilder()
      .select(['Workout', 'User'])
      .leftJoinAndSelect('Workout.user', 'User')
      .where('Workout.isPrivate = :isPrivate', { isPrivate: false })
      .skip(skip)
      .take(take);
    if (searchTerm) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('Workout.name ILIKE :name', {
            name: `%${searchTerm}%`,
          });
          qb.orWhere('User.username ILIKE :username', {
            username: `%${searchTerm}%`,
          });
        }),
      );
    }

    const [items, count] = await qb.getManyAndCount();
    const itemsToDomain: WorkoutDomain[] = [];
    for await (const item of items) {
      const itemToDomain = await this.mapper.toDomain(item);

      if (itemToDomain.isRight()) {
        itemsToDomain.push(itemToDomain.value);
      }
    }

    return { items: itemsToDomain, count };
  }

  public async update(
    id: string,
    item: DeepPartial<Workout>,
  ): Promise<Either<RepositoryError, boolean>> {
    const { userId, name } = item;
    const isDuplicated = await this.preventDuplicatedUser({
      id,
      userId,
      name,
    });

    if (isDuplicated.isLeft()) {
      return left(isDuplicated.value);
    }

    try {
      await this.repository.update(id, item);
      return right(true);
    } catch (err) {
      return left(RepositoryError.create((err as Error).message));
    }
  }
}
