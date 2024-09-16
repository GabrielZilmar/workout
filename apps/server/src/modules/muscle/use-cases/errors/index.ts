import { HttpStatus } from '@nestjs/common';

export class MuscleUseCaseError extends Error {
  public readonly code: number;
  public readonly payload?: unknown;
  public static messages = {
    muscleNotFound: (id: string) => `Muscle with id: ${id} was not found`,
  };

  constructor(message: string, code: number, payload?: unknown) {
    super(message);
    this.name = 'muscle-use-case';
    this.payload = payload || null;
    this.code = code;
  }

  public static create(
    message: string,
    payload?: unknown,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new MuscleUseCaseError(message, code, payload);
  }
}
