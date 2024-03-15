import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  UpdateWorkoutBodyDto,
  UpdateWorkoutParamsDto,
} from '~/modules/workout/dto/update-workout.dto';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

type UpdateWorkoutParams = UpdateWorkoutParamsDto &
  UpdateWorkoutBodyDto & { userId: string };
type UpdateWorkoutResult = Promise<boolean>;

@Injectable()
export class UpdateWorkout
  implements UseCase<UpdateWorkoutParams, UpdateWorkoutResult>
{
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly workoutMapper: WorkoutMapper,
  ) {}

  public async execute({
    id,
    userId,
    ...params
  }: UpdateWorkoutParams): UpdateWorkoutResult {
    const workout = await this.workoutRepository.findOneById(id);
    if (!workout) {
      throw new BadRequestException(
        WorkoutUseCaseError.messages.workoutNotFound(id),
      );
    }

    const canUpdate = workout.userId === userId;
    if (!canUpdate) {
      throw new ForbiddenException(
        WorkoutUseCaseError.messages.cannotUpdateOthersWorkout,
      );
    }

    const workoutDomainUpdatedOrError = workout.update(params);
    if (workoutDomainUpdatedOrError.isLeft()) {
      throw new HttpException(
        {
          message: workoutDomainUpdatedOrError.value.message,
        },
        workoutDomainUpdatedOrError.value.code,
      );
    }

    const workoutData = this.workoutMapper.toPersistence(
      workoutDomainUpdatedOrError.value,
    );
    const workoutUpdatedOrError = await this.workoutRepository.update(id, {
      ...workoutData,
    });

    if (workoutUpdatedOrError.isLeft()) {
      if (workoutUpdatedOrError.value.code === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException({
          statusCode: workoutUpdatedOrError.value.code,
          message: workoutUpdatedOrError.value.message,
          payload: workoutUpdatedOrError.value.payload,
        });
      }

      throw new HttpException(
        {
          message: workoutUpdatedOrError.value.message,
        },
        workoutUpdatedOrError.value.code,
      );
    }

    return workoutUpdatedOrError.value;
  }
}
