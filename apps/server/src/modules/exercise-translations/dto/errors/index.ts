import { HttpStatus } from '@nestjs/common';

export class ExerciseTranslationDtoError extends Error {
  public readonly code: number;
  public static messages = {
    missingId: 'Could not transform to DTO. Missing ID',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'exercise-translation-dto';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new ExerciseTranslationDtoError(message, code);
  }
}
