import { HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { Exercise } from '~/modules/exercise/entities/exercise.entity';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { Either, left, right } from '~/shared/either';

type PrivateDuplicateItemParams = {
  id?: string;
  name?: string;
};

@Injectable()
export default class ExerciseRepository extends BaseRepository<
  Exercise,
  ExerciseDomain
> {
  mapper: ExerciseMapper;

  constructor(exerciseMapper: ExerciseMapper) {
    super(Exercise, exerciseMapper);
  }

  private async preventDuplicateExercise({
    id,
    name,
  }: PrivateDuplicateItemParams): Promise<Either<RepositoryError, boolean>> {
    const itemExist = await this.findOne({ where: { name } });

    if (itemExist) {
      const isSameUser = itemExist.id?.toValue() === id;
      if (isSameUser) {
        return right(true);
      }

      return left(
        RepositoryError.create(
          RepositoryError.messages.itemAlreadyExists,
          {
            name,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(true);
  }

  public async create(
    item: DeepPartial<Exercise>,
  ): Promise<Either<RepositoryError, ExerciseDomain>> {
    const { name } = item;

    const isDuplicated = await this.preventDuplicateExercise({
      name,
    });
    if (isDuplicated.isLeft()) {
      return left(isDuplicated.value);
    }

    try {
      const createdItem = await this.repository.save(item);
      const domainItem = this.mapper.toDomain(createdItem);

      return domainItem;
    } catch (err) {
      return left(RepositoryError.create((err as Error).message));
    }
  }

  public async update(
    id: string,
    item: DeepPartial<Exercise>,
  ): Promise<Either<RepositoryError, boolean>> {
    const { name } = item;
    const isDuplicated = await this.preventDuplicateExercise({
      id,
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
