import { IsInt, IsUUID, ValidateIf } from 'class-validator';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExerciseDtoError } from '~/modules/workout-exercise/dto/errors';
import { Either, left, right } from '~/shared/either';

export class WorkoutExerciseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  workoutId: string;

  @IsUUID()
  exerciseId: string;

  @IsInt()
  @ValidateIf((_, value) => value !== null)
  order: number | null;

  public static domainToDto(
    domain: WorkoutExerciseDomain,
  ): Either<WorkoutExerciseDtoError, WorkoutExerciseDto> {
    const { id, workoutId, exerciseId, order } = domain;

    if (!id) {
      return left(
        WorkoutExerciseDtoError.create(
          WorkoutExerciseDtoError.messages.missingId,
        ),
      );
    }

    const workoutExerciseDto = new WorkoutExerciseDto();
    workoutExerciseDto.id = id.toString();
    workoutExerciseDto.workoutId = workoutId;
    workoutExerciseDto.exerciseId = exerciseId;
    workoutExerciseDto.order = order.value;

    return right(workoutExerciseDto);
  }
}
