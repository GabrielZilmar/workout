import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { ExerciseDtoError } from '~/modules/exercise/dto/errors';
import { MuscleDto } from '~/modules/muscle/dto/muscle.dto';
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
  tutorialUrl?: string | null;

  @IsString()
  @IsOptional()
  info?: string | null;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MuscleDto)
  muscle?: MuscleDto;

  public static domainToDto(
    domain: ExerciseDomain,
  ): Either<ExerciseDtoError, ExerciseDto> {
    const { id, name, muscleId, tutorialUrl, info, muscleDomain } = domain;

    if (!id) {
      return left(ExerciseDtoError.create(ExerciseDtoError.messages.missingId));
    }

    const exerciseDto = new ExerciseDto();
    exerciseDto.id = id.toString();
    exerciseDto.name = name.value;
    exerciseDto.muscleId = muscleId;
    exerciseDto.tutorialUrl = tutorialUrl?.value ?? null;
    exerciseDto.info = info?.value ?? null;

    if (muscleDomain) {
      const muscleDTO = muscleDomain.toDto();
      if (muscleDTO.isLeft()) {
        return left(muscleDTO.value);
      }

      exerciseDto.muscle = muscleDTO.value;
    }

    return right(exerciseDto);
  }
}
