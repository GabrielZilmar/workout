import { HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { Either, left, right } from '~/shared/either';

type PrivateDuplicateItemParams = {
  id?: string;
  name?: string;
};

@Injectable()
export default class MuscleRepository extends BaseRepository<
  Muscle,
  MuscleDomain
> {
  mapper: MuscleMapper;

  constructor(muscleMapper: MuscleMapper) {
    super(Muscle, muscleMapper);
  }

  async preventDuplicateMuscle({
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
    item: DeepPartial<Muscle>,
  ): Promise<Either<RepositoryError, MuscleDomain>> {
    const { id, name } = item;

    const isDuplicated = await this.preventDuplicateMuscle({
      id: id?.toString(),
      name,
    });

    if (isDuplicated.isLeft()) {
      return left(isDuplicated.value);
    }

    try {
      const newMuscle = await this.repository.save(item);
      const newMuscleDomain = this.mapper.toDomain(newMuscle);

      return newMuscleDomain;
    } catch (err) {
      return left(RepositoryError.create((err as Error).message));
    }
  }

  public async update(
    id: string,
    item: DeepPartial<Muscle>,
  ): Promise<Either<RepositoryError, boolean>> {
    const { name } = item;
    const isDuplicated = await this.preventDuplicateMuscle({
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
