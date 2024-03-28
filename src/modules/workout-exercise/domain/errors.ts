import { HttpStatus } from '@nestjs/common';

export class WorkoutExerciseDomainError extends Error {
  public readonly code: number;
  public static messages = {
    missingProps:
      'Missing workout exercises props. Required: WorkoutId and ExerciseId',
    invalidOrder: 'The order must be greater than or equal 0',
    workoutDomainAndWorkoutIdDoNotMatch:
      'The workout domain and workout id do not match',
    exerciseDomainAndExerciseIdDoNotMatch:
      'The exercise domain and exercise id do not match',
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
