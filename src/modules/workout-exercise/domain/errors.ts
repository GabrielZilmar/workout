import { HttpStatus } from '@nestjs/common';

export class WorkoutExerciseDomainError extends Error {
  public readonly code: number;
  public static messages = {
    invalidOrder: 'The order must be greater than 0',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'workout-exercise-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new WorkoutExerciseDomainError(message, code);
  }
}
