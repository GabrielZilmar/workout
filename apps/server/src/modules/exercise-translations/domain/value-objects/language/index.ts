import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import {
  LANGUAGE_ENUM,
  Languages,
} from '~/modules/exercise-translations/entities/exercise-translation.entity';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export type ExerciseTranslationLanguageProps = {
  value: Languages;
};

export default class ExerciseTranslationLanguage extends ValueObject<ExerciseTranslationLanguageProps> {
  private constructor(props: ExerciseTranslationLanguageProps) {
    super(props);
  }

  get value(): Languages {
    return this.props.value;
  }

  private static isValid(language: Languages) {
    return LANGUAGE_ENUM.includes(language);
  }

  public static create(
    value: Languages,
  ): Either<ExerciseTranslationDomainError, ExerciseTranslationLanguage> {
    if (!this.isValid(value)) {
      return left(
        ExerciseTranslationDomainError.create(
          ExerciseTranslationDomainError.messages.invalidLanguage,
        ),
      );
    }
    return right(new ExerciseTranslationLanguage({ value }));
  }
}
