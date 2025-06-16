import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import ExerciseTranslationLanguage from '~/modules/exercise-translations/domain/value-objects/language';
import {
  LANGUAGE_ENUM,
  Languages,
} from '~/modules/exercise-translations/entities/exercise-translation.entity';

describe('Language Value Object', () => {
  type ExerciseTranslationLanguagePublicClass = ExerciseTranslationLanguage & {
    isValid(): boolean;
  };

  it('Should create the value object', async () => {
    const isValidSpy = jest.spyOn(
      ExerciseTranslationLanguage as unknown as ExerciseTranslationLanguagePublicClass,
      'isValid',
    );
    const languageEnumLength = LANGUAGE_ENUM.length;
    const randomLanguage = LANGUAGE_ENUM[
      Math.floor(Math.random() * languageEnumLength)
    ] as Languages;
    const language = ExerciseTranslationLanguage.create(randomLanguage);
    expect(language.isRight()).toBeTruthy();
    expect(language.value).toBeInstanceOf(ExerciseTranslationLanguage);
    expect(isValidSpy).toHaveBeenCalled();
    const tokenTypeValueObject = language.value as ExerciseTranslationLanguage;
    expect(tokenTypeValueObject.value).toBe(randomLanguage);
  });

  it('Should not create the value object with invalid type', async () => {
    const isValidSpy = jest.spyOn(
      ExerciseTranslationLanguage as unknown as ExerciseTranslationLanguagePublicClass,
      'isValid',
    );
    const invalidLanguage = 'invalid_language' as Languages;
    const language = ExerciseTranslationLanguage.create(invalidLanguage);
    expect(language.isLeft()).toBeTruthy();
    expect(language.value).toBeInstanceOf(Error);
    expect(isValidSpy).toHaveBeenCalled();
    const languageValueObject =
      language.value as ExerciseTranslationDomainError;
    expect(languageValueObject.message).toBe(
      ExerciseTranslationDomainError.messages.invalidLanguage,
    );
  });
});
