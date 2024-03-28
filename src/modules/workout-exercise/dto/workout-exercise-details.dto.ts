import { IsInt, IsUUID, ValidateIf } from 'class-validator';
import { SetDto } from '~/modules/set/dto/set.dto';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExerciseDtoError } from '~/modules/workout-exercise/dto/errors';
import { Either, left, right } from '~/shared/either';

export class WorkoutExerciseDetailsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  workoutId: string;

  @IsUUID()
  exerciseId: string;

  @IsInt()
  @ValidateIf((_, value) => value !== null)
  order: number | null;

  setDtos: SetDto[];

  public static domainToDto(
    domain: WorkoutExerciseDomain,
  ): Either<WorkoutExerciseDtoError, WorkoutExerciseDetailsDto> {
    const { id, workoutId, exerciseId, order, setDtos } = domain;

    if (!id) {
      return left(
        WorkoutExerciseDtoError.create(
          WorkoutExerciseDtoError.messages.missingId,
        ),
      );
    }

    if (!setDtos) {
      return left(
        WorkoutExerciseDtoError.create(
          WorkoutExerciseDtoError.messages.missingSetDomain,
        ),
      );
    }

    const workoutExerciseDto = new WorkoutExerciseDetailsDto();
    workoutExerciseDto.id = id.toString();
    workoutExerciseDto.workoutId = workoutId;
    workoutExerciseDto.exerciseId = exerciseId;
    workoutExerciseDto.order = order.value;
    workoutExerciseDto.setDtos = setDtos;

    return right(workoutExerciseDto);
  }
}
