import { HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import ExerciseTranslationDomain from '~/modules/exercise-translations/domain/exercise-translation.domain';
import {
  ExerciseTranslation,
  Languages,
} from '~/modules/exercise-translations/entities/exercise-translation.entity';
import ExerciseTranslationMapper from '~/modules/exercise-translations/mappers/exercise-translation.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { Either, left, right } from '~/shared/either';

type PreventDuplicateParams = {
  id?: string;
  name?: string;
  exerciseId?: string;
  language?: Languages;
};

@Injectable()
export default class ExerciseTranslationRepository extends BaseRepository<
  ExerciseTranslation,
  ExerciseTranslationDomain
> {
  mapper: ExerciseTranslationMapper;

  constructor(exerciseTranslationMapper: ExerciseTranslationMapper) {
    super(ExerciseTranslation, exerciseTranslationMapper);
  }

  private async preventDuplicate({
    id,
    name,
    exerciseId,
    language,
  }: PreventDuplicateParams): Promise<Either<RepositoryError, boolean>> {
    const itemExist = await this.findOne({
      where: [{ name }, { language, exerciseId }],
    });
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
    item: DeepPartial<ExerciseTranslation>,
  ): Promise<Either<RepositoryError, ExerciseTranslationDomain>> {
    const { name, language, exerciseId } = item;
    const isDuplicated = await this.preventDuplicate({
      name,
      language,
      exerciseId,
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
    item: DeepPartial<ExerciseTranslation>,
  ): Promise<Either<RepositoryError, boolean>> {
    const { name, language, exerciseId } = item;
    const isDuplicated = await this.preventDuplicate({
      id,
      name,
      language,
      exerciseId,
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
