import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PublicUserDto } from '~/modules/users/dto/public-user.dto';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { WorkoutDtoError } from '~/modules/workout/dto/errors/workout-dto-errors';
import { ListWorkoutsDto } from '~/modules/workout/dto/list-workouts.dto';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import { Either, left, right } from '~/shared/either';

export class ListPublicWorkoutsDto extends ListWorkoutsDto {
  @IsString()
  @IsOptional()
  searchTerm?: string;
}

export class PublicWorkoutDTO extends WorkoutDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PublicUserDto)
  user: PublicUserDto;

  public static domainToDto(
    domain: WorkoutDomain,
  ): Either<WorkoutDtoError, PublicWorkoutDTO> {
    const { id, name, userId, privateStatus, routineStatus, userDomain } =
      domain;

    if (!id) {
      return left(
        WorkoutDtoError.create(
          WorkoutDtoError.messages.missingId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    if (!userDomain) {
      return left(
        WorkoutDtoError.create(
          WorkoutDtoError.messages.missingUser,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const userDTO = PublicUserDto.domainToDto(userDomain);
    if (userDTO.isLeft()) {
      return left(userDTO.value);
    }

    const workoutDto = new PublicWorkoutDTO();
    workoutDto.id = id.toString();
    workoutDto.name = name.value;
    workoutDto.userId = userId;
    workoutDto.isPrivate = privateStatus.isPrivate();
    workoutDto.isRoutine = routineStatus.isRoutine();
    workoutDto.user = userDTO.value;

    return right(workoutDto);
  }
}
