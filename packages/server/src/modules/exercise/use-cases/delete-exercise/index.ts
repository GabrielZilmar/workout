import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteExerciseParamsDto } from '~/modules/exercise/dto/delete-exercise.dto';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';

type DeleteExerciseParams = DeleteExerciseParamsDto;
type DeleteExerciseResult = Promise<boolean>;

@Injectable()
export class DeleteExercise {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  public async execute({ id }: DeleteExerciseParams): DeleteExerciseResult {
    const exercise = await this.exerciseRepository.findOneById(id);
    if (!exercise) {
      throw new NotFoundException(
        ExerciseUseCaseError.messages.exerciseNotFound(id),
      );
    }

    const deleteExerciseOrError = await this.exerciseRepository.delete(id);
    if (deleteExerciseOrError.isLeft()) {
      throw new HttpException(
        {
          message: deleteExerciseOrError.value.message,
        },
        deleteExerciseOrError.value.code,
      );
    }

    return true;
  }
}
