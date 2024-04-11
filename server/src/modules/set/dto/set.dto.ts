import { HttpStatus } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import SetDomain from '~/modules/set/domain/set.domain';
import { SetDtoError } from '~/modules/set/dto/errors/set-dto-errors';
import { Either, left, right } from '~/shared/either';

export class SetDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  workoutExerciseId: string;

  @IsInt()
  @IsNotEmpty()
  numReps: number;

  @IsInt()
  @IsNotEmpty()
  setWeight: number;

  @IsInt()
  @IsNotEmpty()
  numDrops: number;

  public static domainToDto(domain: SetDomain): Either<SetDtoError, SetDto> {
    const { id, workoutExerciseId, numReps, setWeight, numDrops } = domain;

    if (!id) {
      return left(
        SetDtoError.create(
          SetDtoError.messages.missingId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const setDto = new SetDto();
    setDto.id = id.toString();
    setDto.workoutExerciseId = workoutExerciseId;
    setDto.numReps = numReps.value;
    setDto.setWeight = setWeight.value;
    setDto.numDrops = numDrops.value;

    return right(setDto);
  }
}
