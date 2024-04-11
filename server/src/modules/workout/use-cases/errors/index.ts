import { HttpStatus } from '@nestjs/common';

export class WorkoutUseCaseError extends Error {
  public readonly code: number;
  public readonly payload?: unknown;
  public static messages = {
    workoutNotFound: (id: string) => `Workout with id: ${id} was not found`,
    workoutIsPrivate: 'Workout is private.',
    cannotUpdateOthersWorkout: 'Cannot update others workout.',
    cannotDeleteOthersWorkout: 'Cannot delete others workout.',
  };

  constructor(message: string, code: number, payload?: unknown) {
    super(message);
    this.name = 'workout-use-case';
    this.payload = payload || null;
    this.code = code;
  }

  public static create(
    message: string,
    payload?: unknown,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new WorkoutUseCaseError(message, code, payload);
  }
}
