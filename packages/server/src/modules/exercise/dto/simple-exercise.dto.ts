import { IsString, IsUUID } from 'class-validator';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { ExerciseDtoError } from '~/modules/exercise/dto/errors';
import { Either, left, right } from '~/shared/either';

export class SimpleExerciseDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsUUID()
  muscleId: string;

  public static domainToDto(
    domain: ExerciseDomain,
  ): Either<ExerciseDtoError, SimpleExerciseDto> {
    const { id, name, muscleId } = domain;

    if (!id) {
      return left(ExerciseDtoError.create(ExerciseDtoError.messages.missingId));
    }

    const exerciseDto = new SimpleExerciseDto();
    exerciseDto.id = id.toString();
    exerciseDto.name = name.value;
    exerciseDto.muscleId = muscleId;

    return right(exerciseDto);
  }
}
