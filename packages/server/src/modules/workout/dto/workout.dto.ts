import { HttpStatus } from '@nestjs/common';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { WorkoutDtoError } from '~/modules/workout/dto/errors/workout-dto-errors';
import { Either, left, right } from '~/shared/either';

export class WorkoutDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isRoutine?: boolean;

  public static domainToDto(
    domain: WorkoutDomain,
  ): Either<WorkoutDtoError, WorkoutDto> {
    const { id, name, userId, privateStatus, routineStatus } = domain;

    if (!id) {
      return left(
        WorkoutDtoError.create(
          WorkoutDtoError.messages.missingId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const workoutDto = new WorkoutDto();
    workoutDto.id = id.toString();
    workoutDto.name = name.value;
    workoutDto.userId = userId;
    workoutDto.isPrivate = privateStatus.isPrivate();
    workoutDto.isRoutine = routineStatus.isRoutine();

    return right(workoutDto);
  }
}
