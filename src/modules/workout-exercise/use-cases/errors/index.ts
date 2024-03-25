import { HttpStatus } from '@nestjs/common';

export class WorkoutExerciseUseCaseError extends Error {
  public readonly code: number;
  public readonly payload?: unknown;
  public static messages = {
    workoutNotFound: (id: string) =>
      `Workout with id: ${id} was not found. Insert a valid workout id`,
    exerciseNotFound: (id: string) =>
      `Exercise with id: ${id} was not found. Insert a valid exercise id`,
    workoutNotBelongToUser: (workoutId: string) =>
      `Workout with id: ${workoutId} does not belong to the user`,
  };

  constructor(message: string, code: number, payload?: unknown) {
    super(message);
    this.name = 'workout-exercise-use-case';
    this.payload = payload || null;
    this.code = code;
  }

  public static create(
    message: string,
    payload?: unknown,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new WorkoutExerciseUseCaseError(message, code, payload);
  }
}
