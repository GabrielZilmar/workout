import { IsString, IsUUID } from 'class-validator';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { MuscleDtoError } from '~/modules/muscle/dto/errors';
import { Either, left, right } from '~/shared/either';

export class MuscleDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  public static domainToDto(
    domain: MuscleDomain,
  ): Either<MuscleDtoError, MuscleDto> {
    const { id, name } = domain;

    if (!id) {
      return left(MuscleDtoError.create(MuscleDtoError.messages.missingId));
    }

    const muscleDto = new MuscleDto();
    muscleDto.id = id.toString();
    muscleDto.name = name.value;

    return right(muscleDto);
  }
}
