import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ExerciseDto } from '~/modules/exercise/dto/exercise.dto';
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

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => ExerciseDto)
  exercise?: ExerciseDto;

  public static domainToDto(
    domain: WorkoutExerciseDomain,
  ): Either<WorkoutExerciseDtoError, WorkoutExerciseDto> {
    const { id, workoutId, exerciseId, order, exerciseDomain } = domain;

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
    if (exerciseDomain) {
      const exerciseDtoOrError = exerciseDomain.toDto();
      if (exerciseDtoOrError.isLeft()) {
        return left(exerciseDtoOrError.value);
      }
      workoutExerciseDto.exercise = exerciseDtoOrError.value;
    }

    return right(workoutExerciseDto);
  }
}
