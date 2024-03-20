import { IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { ExerciseDtoError } from '~/modules/exercise/dto/errors';
import { Either, left, right } from '~/shared/either';

export class ExerciseDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsUUID()
  muscleId: string;

  @IsUrl()
  @IsOptional()
  tutorialUrl?: string;

  @IsString()
  @IsOptional()
  info?: string;

  public static domainToDto(
    domain: ExerciseDomain,
  ): Either<ExerciseDtoError, ExerciseDto> {
    const { id, name, muscleId, tutorialUrl, info } = domain;

    if (!id) {
      return left(ExerciseDtoError.create(ExerciseDtoError.messages.missingId));
    }

    const exerciseDto = new ExerciseDto();
    exerciseDto.id = id.toString();
    exerciseDto.name = name.value;
    exerciseDto.muscleId = muscleId;
    exerciseDto.tutorialUrl = tutorialUrl?.value;
    exerciseDto.info = info?.value;

    return right(exerciseDto);
  }
}
