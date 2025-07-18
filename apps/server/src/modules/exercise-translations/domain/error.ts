import { HttpStatus } from '@nestjs/common';
import { MIN_EXERCISE_TRANSLATION_NAME_LENGTH } from '~/modules/exercise-translations/domain/value-objects/name';

export class ExerciseTranslationDomainError extends Error {
  public readonly code: number;
  public static messages = {
    missingProps:
      'Missing exercise translation props. Required: name, language, exerciseId',
    invalidName: `Invalid exercise translation name. Name can not be an empty string and min length is ${MIN_EXERCISE_TRANSLATION_NAME_LENGTH}`,
    invalidInfo: 'Invalid info, info can not be an empty string',
    invalidLanguage: 'Invalid language.',
    translationNotFound: 'Translation was not found.',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'exercise-translation-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new ExerciseTranslationDomainError(message, code);
  }
}
