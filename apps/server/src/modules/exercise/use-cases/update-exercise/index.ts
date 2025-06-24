import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import ExerciseTranslationDomain from '~/modules/exercise-translations/domain/exercise-translation.domain';
import ExerciseTranslationMapper from '~/modules/exercise-translations/mappers/exercise-translation.mapper';
import {
  UpdateExerciseBodyDto,
  UpdateExerciseParamsDto,
} from '~/modules/exercise/dto/update-exercise.dto';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import ExerciseTranslationRepository from '~/services/database/typeorm/repositories/exercise-translation-repository';
import { UseCase } from '~/shared/core/use-case';

type UpdateExerciseParams = UpdateExerciseParamsDto & UpdateExerciseBodyDto;
type UpdateExerciseResult = Promise<boolean>;

@Injectable()
export class UpdateExercise
  implements UseCase<UpdateExerciseParams, UpdateExerciseResult>
{
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly exerciseTranslationRepository: ExerciseTranslationRepository,
    private readonly exerciseMapper: ExerciseMapper,
    private readonly exerciseTranslationMapper: ExerciseTranslationMapper,
  ) {}

  private async updateTranslations(
    exerciseId: string,
    translations: NonNullable<UpdateExerciseParams['translations']>,
  ): Promise<ExerciseTranslationDomain[]> {
    return Promise.all(
      translations.map(async (item) => {
        const translation =
          await this.exerciseTranslationRepository.findOneByIdAndExerciseId({
            id: item.id,
            exerciseId,
          });
        if (!translation) {
          throw new NotFoundException({
            message:
              ExerciseTranslationDomainError.messages.translationNotFound,
          });
        }

        const translationDomainUpdatedOrError = translation.update({
          name: item.name,
          language: item.language,
          info: item.info,
        });
        if (translationDomainUpdatedOrError.isLeft()) {
          throw new HttpException(
            { message: translationDomainUpdatedOrError.value.message },
            translationDomainUpdatedOrError.value.code,
          );
        }

        const translationData = this.exerciseTranslationMapper.toPersistence(
          translationDomainUpdatedOrError.value,
        );
        const translationUpdatedOrError =
          await this.exerciseTranslationRepository.update(
            item.id,
            translationData,
          );
        if (translationUpdatedOrError.isLeft()) {
          throw new HttpException(
            { message: translationUpdatedOrError.value.message },
            translationUpdatedOrError.value.code,
          );
        }

        return translationDomainUpdatedOrError.value;
      }),
    );
  }

  public async execute({
    id,
    name,
    muscleId,
    tutorialUrl,
    info,
    translations,
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

    if (translations?.length) {
      await this.updateTranslations(id, translations);
    }

    return true;
  }
}
