import { IsEnum, IsString, IsUUID } from 'class-validator';
import ExerciseTranslationDomain from '~/modules/exercise-translations/domain/exercise-translation.domain';
import { ExerciseTranslationDtoError } from '~/modules/exercise-translations/dto/errors';
import {
  LANGUAGE_ENUM,
  Languages,
} from '~/modules/exercise-translations/entities/exercise-translation.entity';
import { Either, left, right } from '~/shared/either';

export class ExerciseTranslationDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  info: string | null;

  @IsEnum(LANGUAGE_ENUM)
  language: Languages;

  public static domainToDto(
    domain: ExerciseTranslationDomain,
  ): Either<ExerciseTranslationDtoError, ExerciseTranslationDTO> {
    const { id, name, info, language } = domain;

    if (!id) {
      return left(
        ExerciseTranslationDtoError.create(
          ExerciseTranslationDtoError.messages.missingId,
        ),
      );
    }

    const dto = new ExerciseTranslationDTO();
    dto.id = id.toString();
    dto.name = name.value;
    dto.info = info?.value ?? null;
    dto.language = language.value;

    return right(dto);
  }
}
