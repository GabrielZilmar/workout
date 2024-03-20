import { HttpStatus } from '@nestjs/common';
import { MIN_EXERCISE_NAME_LENGTH } from '~/modules/exercise/domain/value-objects/name';

export class ExerciseDomainError extends Error {
  public readonly code: number;
  public static messages = {
    invalidExerciseName: `Invalid exercise name, must be at least ${MIN_EXERCISE_NAME_LENGTH} characters`,
    invalidExerciseInfo: 'Exercise info cannot be an empty string',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'exercise-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new ExerciseDomainError(message, code);
  }
}
