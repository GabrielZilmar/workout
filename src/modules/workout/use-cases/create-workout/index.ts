import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { CreateWorkoutDto } from '~/modules/workout/dto/create-workout.dto';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

export type CreateWorkoutParams = CreateWorkoutDto & { userId: string };
export type CreateWorkoutResult = Promise<WorkoutDto>;

@Injectable()
export class CreateWorkout
  implements UseCase<CreateWorkoutParams, CreateWorkoutResult>
{
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly userRepository: UserRepository,
    private readonly workoutMapper: WorkoutMapper,
  ) {}

  public async execute({
    name,
    userId,
    isPrivate,
    isRoutine,
  }: CreateWorkoutParams): Promise<CreateWorkoutResult> {
    const userExists = await this.userRepository.findOneById(userId);
    if (!userExists) {
      throw new BadRequestException({
        message: WorkoutDomainError.messages.userNotFound(userId),
      });
    }

    const workoutDomainOrError = WorkoutDomain.create({
      name,
      userId,
      isPrivate,
      isRoutine,
    });
    if (workoutDomainOrError.isLeft()) {
      throw new HttpException(
        { message: workoutDomainOrError.value.message },
        workoutDomainOrError.value.code,
      );
    }

    const workoutCreatedOrError = await this.workoutRepository.create(
      this.workoutMapper.toPersistence(workoutDomainOrError.value),
    );
    if (workoutCreatedOrError.isLeft()) {
      throw new HttpException(
        {
          message: workoutCreatedOrError.value.message,
          payload: workoutCreatedOrError.value.payload,
        },
        workoutCreatedOrError.value.code,
      );
    }

    const workoutDto = workoutCreatedOrError.value.toDto();
    if (workoutDto.isLeft()) {
      throw new HttpException(
        { message: workoutDto.value.message },
        workoutDto.value.code,
      );
    }

    return workoutDto.value;
  }
}
