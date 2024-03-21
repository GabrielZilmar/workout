import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { CreateExerciseDto } from '~/modules/exercise/dto/create-exercise.dto';
import { ExerciseDto } from '~/modules/exercise/dto/exercise.dto';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { UseCase } from '~/shared/core/use-case';

type CreateExerciseParams = CreateExerciseDto;
type CreateExerciseResult = Promise<ExerciseDto>;

@Injectable()
export class CreateExercise
  implements UseCase<CreateExerciseParams, CreateExerciseResult>
{
  constructor(
    private exerciseRepository: ExerciseRepository,
    private muscleRepository: MuscleRepository,
    private readonly exerciseMapper: ExerciseMapper,
  ) {}

  async execute({
    name,
    muscleId,
    tutorialUrl,
    info,
  }: CreateExerciseParams): CreateExerciseResult {
    const exerciseDomainOrError = ExerciseDomain.create({
      name,
      muscleId,
      tutorialUrl,
      info,
    });
    if (exerciseDomainOrError.isLeft()) {
      throw new HttpException(
        { message: exerciseDomainOrError.value.message },
        exerciseDomainOrError.value.code,
      );
    }

    const muscleExists = await this.muscleRepository.findOneById(muscleId);
    if (!muscleExists) {
      throw new NotFoundException(
        ExerciseUseCaseError.messages.muscleNotFound(muscleId),
      );
    }

    const exerciseCreatedOrError = await this.exerciseRepository.create(
      this.exerciseMapper.toPersistence(exerciseDomainOrError.value),
    );
    if (exerciseCreatedOrError.isLeft()) {
      throw new HttpException(
        { message: exerciseCreatedOrError.value.message },
        exerciseCreatedOrError.value.code,
      );
    }

    const exerciseDto = exerciseCreatedOrError.value.toDto();
    if (exerciseDto.isLeft()) {
      throw new HttpException(
        { message: exerciseDto.value.message },
        exerciseDto.value.code,
      );
    }

    return exerciseDto.value;
  }
}
