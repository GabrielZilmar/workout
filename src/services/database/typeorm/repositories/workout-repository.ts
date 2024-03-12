import { HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
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
          HttpStatus.BAD_REQUEST,
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
      const newWorkoutDomain = this.mapper.toDomain(newWorkout);

      return newWorkoutDomain;
    } catch (err) {
      return left(
        RepositoryError.create(
          RepositoryError.messages.createError,
          (err as Error).message,
        ),
      );
    }
  }
}
