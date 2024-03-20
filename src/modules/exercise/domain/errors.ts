import { HttpStatus } from '@nestjs/common';

export class ExerciseDomainError extends Error {
  public readonly code: number;
  public static messages = {
    invalidNumReps:
      'Invalid number of repetitions, it must be a positive number',
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
