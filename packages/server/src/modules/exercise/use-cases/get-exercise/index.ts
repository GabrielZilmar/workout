import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { ExerciseDto } from '~/modules/exercise/dto/exercise.dto';
import { GetExerciseDto } from '~/modules/exercise/dto/get-exercise.dto';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import { UseCase } from '~/shared/core/use-case';

type GetExerciseParams = GetExerciseDto;
type GetExerciseResult = Promise<ExerciseDto>;

@Injectable()
export class GetExercise
  implements UseCase<GetExerciseParams, GetExerciseResult>
{
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  public async execute({ idOrUsername }: GetExerciseParams): GetExerciseResult {
    let exercise: ExerciseDomain | null = null;

    const isId = validateUUID(idOrUsername);
    try {
      exercise = isId
        ? await this.exerciseRepository.findOneById(idOrUsername)
        : await this.exerciseRepository.findOne({
            where: { name: idOrUsername },
          });
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }

    if (!exercise) {
      if (isId) {
        throw new NotFoundException(
          ExerciseUseCaseError.messages.exerciseNotFound(idOrUsername),
        );
      }

      throw new NotFoundException(
        ExerciseUseCaseError.messages.exerciseByNameNotFound(idOrUsername),
      );
    }

    const exerciseDto = exercise.toDto();
    if (exerciseDto.isLeft()) {
      throw new HttpException(
        exerciseDto.value.message,
        exerciseDto.value.code,
      );
    }

    return exerciseDto.value;
  }
}
