import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import GetWorkoutDto from '~/modules/workout/dto/get-workout.dto';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

type GetWorkoutParams = GetWorkoutDto & { userId: string };
type GetWorkoutResult = WorkoutDto;

@Injectable()
export class GetWorkout implements UseCase<GetWorkoutParams, GetWorkoutResult> {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  public async execute({
    id,
    userId,
  }: GetWorkoutParams): Promise<GetWorkoutResult> {
    const workout = await this.workoutRepository.findOneById(id);

    if (!workout) {
      throw new BadRequestException({
        message: WorkoutUseCaseError.messages.workoutNotFound(id),
      });
    }

    const userCanSeeWorkout =
      (workout.privateStatus.isPrivate() && workout.userId === userId) ||
      !workout.privateStatus.isPrivate();
    if (!userCanSeeWorkout) {
      throw new ForbiddenException(
        WorkoutUseCaseError.messages.workoutIsPrivate,
      );
    }

    const workoutDtoOrError = workout.toDto();
    if (workoutDtoOrError.isLeft()) {
      throw new HttpException(
        { message: workoutDtoOrError.value.message },
        workoutDtoOrError.value.code,
      );
    }

    return workoutDtoOrError.value;
  }
}
