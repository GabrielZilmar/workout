import { HttpStatus } from '@nestjs/common';

export class WorkoutDomainError extends Error {
  public readonly code: number;
  public static messages = {
    emptyWorkoutName: 'Workout name cannot be empty',
    userNotFound: (userId: string) =>
      `Could not create workout. User ${userId} not found`,
    missingProps: 'Missing props to create workout. Required: name, userId',
    invalidWorkoutExercise:
      'Invalid workout exercise. This workout exercise belongs to another workout',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'workout-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new WorkoutDomainError(message, code);
  }
}
