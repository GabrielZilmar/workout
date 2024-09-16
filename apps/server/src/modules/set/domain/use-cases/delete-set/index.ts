import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import { DeleteSetParamsDto } from '~/modules/set/dto/delete-set.dto';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import { UseCase } from '~/shared/core/use-case';

type DeleteSetParams = DeleteSetParamsDto & { userId: string };
type DeleteSetResult = Promise<boolean>;

@Injectable()
export class DeleteSet implements UseCase<DeleteSetParams, DeleteSetResult> {
  constructor(
    private readonly setRepository: SetRepository,
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
  ) {}

  async execute({ id, userId }: DeleteSetParams): DeleteSetResult {
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

    const deleted = await this.setRepository.delete(id);
    if (deleted.isLeft()) {
      throw new HttpException(deleted.value.message, deleted.value.code);
    }

    return deleted.value;
  }
}
