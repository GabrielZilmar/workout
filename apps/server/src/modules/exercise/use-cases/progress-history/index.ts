import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProgressHistoryQueryDTO,
  ProgressHistoryDTO,
  ProgressHistoryParamsDTO,
} from '~/modules/exercise/dto/progress-history.dto';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import { UseCase } from '~/shared/core/use-case';

type ExerciseProgressHistoryParams = ProgressHistoryParamsDTO &
  ProgressHistoryQueryDTO & { userId: string };
type ExerciseProgressHistoryResult = Promise<ProgressHistoryDTO>;

@Injectable()
export class ExerciseProgress
  implements
    UseCase<ExerciseProgressHistoryParams, ExerciseProgressHistoryResult>
{
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly setRepository: SetRepository,
  ) {}

  public async execute({
    exerciseId,
    userId,
    startDate,
    endDate,
  }: ExerciseProgressHistoryParams): Promise<ExerciseProgressHistoryResult> {
    const exercise = await this.exerciseRepository.findOneById(exerciseId);
    if (!exercise) {
      throw new NotFoundException(
        ExerciseUseCaseError.messages.exerciseNotFound(exerciseId),
      );
    }

    const sets = await this.setRepository.findProgressHistory({
      exerciseId,
      userId,
      startDate,
      endDate,
    });

    return {
      sales: sets.map((set) => ({
        [set.createdAt.getDateStringValue()]: set.setWeight.value,
      })),
    };
  }
}
