import { HttpStatus } from '@nestjs/common';

export class SetUseCaseError extends Error {
  public readonly code: number;
  public readonly payload?: unknown;
  public static messages = {
    setNotFound: (id: string) => `Set with id: ${id} was not found`,
    workoutNotBelongToUser: (workoutId: string) =>
      `Workout with id: ${workoutId} does not belong to the user. User can't create set for this workout`,
    workoutExerciseNotFound: (workoutExerciseId: string) =>
      `Workout exercise with id: ${workoutExerciseId} was not found`,
  };

  constructor(message: string, code: number, payload?: unknown) {
    super(message);
    this.name = 'set-use-case';
    this.payload = payload || null;
    this.code = code;
  }

  public static create(
    message: string,
    payload?: unknown,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new SetUseCaseError(message, code, payload);
  }
}
