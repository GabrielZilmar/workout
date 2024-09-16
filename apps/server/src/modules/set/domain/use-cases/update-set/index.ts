import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import {
  UpdateSetBodyDto,
  UpdateSetParamsDto,
} from '~/modules/set/dto/update-set.dto';
import SetMapper from '~/modules/set/mappers/set.mapper';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import { UseCase } from '~/shared/core/use-case';

type UpdateSetParams = UpdateSetBodyDto &
  UpdateSetParamsDto & { userId: string };
type UpdateSetResult = Promise<boolean>;

@Injectable()
export class UpdateSet implements UseCase<UpdateSetParamsDto, UpdateSetResult> {
  constructor(
    private readonly setRepository: SetRepository,
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
    private readonly setMapper: SetMapper,
  ) {}

  async execute({ id, userId, ...params }: UpdateSetParams): UpdateSetResult {
    const set = await this.setRepository.findOneById(id);
    if (!set) {
      throw new NotFoundException(SetUseCaseError.messages.setNotFound(id));
    }

    const workoutExercise =
      await this.workoutExerciseRepository.findOneByIdWithRelations({
        id: set.workoutExerciseId,
        relations: ['workout'],
      });
    if (!workoutExercise) {
      throw new NotFoundException(
        SetUseCaseError.messages.workoutExerciseNotFound(set.workoutExerciseId),
      );
    }

    if (workoutExercise.workoutDomain?.userId !== userId) {
      throw new ForbiddenException({
        message: SetUseCaseError.messages.workoutNotBelongToUser(
          workoutExercise.workoutId,
        ),
      });
    }

    const updatedDomainOrError = set.update({
      ...params,
    });
    if (updatedDomainOrError.isLeft()) {
      throw new HttpException(
        {
          message: updatedDomainOrError.value.message,
        },
        updatedDomainOrError.value.code,
      );
    }

    const updatedSetOrError = await this.setRepository.update(
      id,
      this.setMapper.toPersistence(updatedDomainOrError.value),
    );
    if (updatedSetOrError.isLeft()) {
      throw new HttpException(
        {
          message: updatedSetOrError.value.message,
        },
        updatedSetOrError.value.code,
      );
    }

    return updatedSetOrError.value;
  }
}
