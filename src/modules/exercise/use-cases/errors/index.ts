import { HttpStatus } from '@nestjs/common';

export class ExerciseUseCaseError extends Error {
  public readonly code: number;
  public readonly payload?: unknown;
  public static messages = {
    exerciseNotFound: (id: string) => `Exercise with id: ${id} was not found`,
    muscleNotFound: (id: string) =>
      `Muscle with id: ${id} was not found. Insert a valid muscle id`,
  };

  constructor(message: string, code: number, payload?: unknown) {
    super(message);
    this.name = 'exercise-use-case';
    this.payload = payload || null;
    this.code = code;
  }

  public static create(
    message: string,
    payload?: unknown,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new ExerciseUseCaseError(message, code, payload);
  }
}
