import { Injectable } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import ExerciseTranslationDomain from '~/modules/exercise-translations/domain/exercise-translation.domain';
import { ExerciseTranslation as ExerciseTranslationEntity } from '~/modules/exercise-translations/entities/exercise-translation.entity';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either } from '~/shared/either';

@Injectable()
export default class ExerciseTranslationMapper
  implements
    Mapper<ExerciseTranslationDomain, Partial<ExerciseTranslationEntity>>
{
  public toDomain(
    raw: ExerciseTranslationEntity,
  ): Either<ExerciseTranslationDomainError, ExerciseTranslationDomain> {
    const { id, name, info, language, exerciseId } = raw;
    const entityId = new UniqueEntityID(id);
    const exerciseTranslationDomainOrError = ExerciseTranslationDomain.create(
      {
        name,
        info: info ?? undefined,
        language,
        exerciseId,
      },
      entityId,
    );
    return exerciseTranslationDomainOrError;
  }

  public toPersistence(
    item: ExerciseTranslationDomain,
  ): Partial<ExerciseTranslationEntity> {
    const { id, name, info, language, exerciseId } = item;
    const exerciseTranslationEntity: Partial<ExerciseTranslationEntity> = {
      id: id?.toString(),
      name: name.value,
      info: info === null ? info : info?.value,
      language: language.value,
      exerciseId,
    };
    return exerciseTranslationEntity;
  }
}
