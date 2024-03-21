import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateExerciseBodyDto,
  UpdateExerciseParamsDto,
} from '~/modules/exercise/dto/update-exercise.dto';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import { UseCase } from '~/shared/core/use-case';

type UpdateExerciseParams = UpdateExerciseParamsDto & UpdateExerciseBodyDto;
type UpdateExerciseResult = Promise<boolean>;

@Injectable()
export class UpdateExercise
  implements UseCase<UpdateExerciseParams, UpdateExerciseResult>
{
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly exerciseMapper: ExerciseMapper,
  ) {}

  public async execute({
    id,
    name,
    muscleId,
    tutorialUrl,
    info,
  }: UpdateExerciseParams): UpdateExerciseResult {
    const exercise = await this.exerciseRepository.findOneById(id);
    if (!exercise) {
      throw new NotFoundException(
        ExerciseUseCaseError.messages.exerciseNotFound(id),
      );
    }

    const exerciseDomainUpdateOrError = exercise.update({
      name,
      muscleId,
      tutorialUrl,
      info,
    });
    if (exerciseDomainUpdateOrError.isLeft()) {
      throw new HttpException(
        { message: exerciseDomainUpdateOrError.value.message },
        exerciseDomainUpdateOrError.value.code,
      );
    }

    const exerciseData = this.exerciseMapper.toPersistence(
      exerciseDomainUpdateOrError.value,
    );
    const updateExerciseOrError = await this.exerciseRepository.update(
      id,
      exerciseData,
    );
    if (updateExerciseOrError.isLeft()) {
      throw new HttpException(
        { message: updateExerciseOrError.value.message },
        updateExerciseOrError.value.code,
      );
    }

    return true;
  }
}
