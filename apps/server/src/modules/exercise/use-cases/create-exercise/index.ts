import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import ExerciseTranslationDomain from '~/modules/exercise-translations/domain/exercise-translation.domain';
import ExerciseTranslationMapper from '~/modules/exercise-translations/mappers/exercise-translation.mapper';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { CreateExerciseDto } from '~/modules/exercise/dto/create-exercise.dto';
import { ExerciseDto } from '~/modules/exercise/dto/exercise.dto';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import ExerciseTranslationRepository from '~/services/database/typeorm/repositories/exercise-translation-repository';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { UseCase } from '~/shared/core/use-case';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type CreateExerciseParams = CreateExerciseDto;
type CreateExerciseResult = Promise<ExerciseDto>;

@Injectable()
export class CreateExercise
  implements UseCase<CreateExerciseParams, CreateExerciseResult>
{
  constructor(
    private exerciseRepository: ExerciseRepository,
    private muscleRepository: MuscleRepository,
    private exerciseTranslationRepository: ExerciseTranslationRepository,
    private readonly exerciseMapper: ExerciseMapper,
    private readonly exerciseTranslationMapper: ExerciseTranslationMapper,
  ) {}

  async execute({
    name,
    muscleId,
    tutorialUrl,
    info,
    translations,
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

    const translationsDomain = await Promise.all(
      (translations || []).map(async (translation) => {
        const translationDomainOrError = ExerciseTranslationDomain.create({
          ...translation,
          exerciseId: (
            exerciseCreatedOrError.value.id as UniqueEntityID
          ).toString(),
        });
        if (translationDomainOrError.isLeft()) {
          throw new HttpException(
            { message: translationDomainOrError.value.message },
            translationDomainOrError.value.code,
          );
        }
        const translationCreatedOrError =
          await this.exerciseTranslationRepository.create(
            this.exerciseTranslationMapper.toPersistence(
              translationDomainOrError.value,
            ),
          );
        if (translationCreatedOrError.isLeft()) {
          throw new HttpException(
            { message: translationCreatedOrError.value.message },
            translationCreatedOrError.value.code,
          );
        }
        return translationCreatedOrError.value;
      }),
    );

    const exerciseUpdatedOrError = exerciseCreatedOrError.value.update({
      translations: translationsDomain,
    });
    if (exerciseUpdatedOrError.isLeft()) {
      throw new HttpException(
        { message: exerciseUpdatedOrError.value.message },
        exerciseUpdatedOrError.value.code,
      );
    }

    const exerciseDto = exerciseUpdatedOrError.value.toDto();
    if (exerciseDto.isLeft()) {
      throw new HttpException(
        { message: exerciseDto.value.message },
        exerciseDto.value.code,
      );
    }

    return exerciseDto.value;
  }
}
