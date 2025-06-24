import { Provider } from '@nestjs/common';
import { ExerciseTranslationMock } from 'test/utils/domains/exercise-translation-domain-mock';
import ExerciseTranslationDomain from '~/modules/exercise-translations/domain/exercise-translation.domain';
import ExerciseTranslationMapper from '~/modules/exercise-translations/mappers/exercise-translation.mapper';
import ExerciseTranslationRepository from '~/services/database/typeorm/repositories/exercise-translation-repository';
import { right } from '~/shared/either';

type GetExerciseTranslationRepositoryProviderParams = {
  exerciseTranslationRepository?: ExerciseTranslationRepository;
  exerciseTranslationDomain?: ExerciseTranslationDomain | null;
};

const getExerciseTranslationRepositoryProvider = ({
  exerciseTranslationRepository,
  exerciseTranslationDomain,
}: GetExerciseTranslationRepositoryProviderParams = {}) => {
  if (exerciseTranslationDomain === undefined) {
    exerciseTranslationDomain =
      ExerciseTranslationMock.mountExerciseTranslationDomain();
  }

  return {
    provide: ExerciseTranslationRepository,
    useFactory: () => {
      if (!exerciseTranslationRepository) {
        exerciseTranslationRepository = new ExerciseTranslationRepository(
          new ExerciseTranslationMapper(),
        ) as jest.Mocked<InstanceType<typeof ExerciseTranslationRepository>>;

        exerciseTranslationRepository.create = jest
          .fn()
          .mockResolvedValue(right(exerciseTranslationDomain));
        exerciseTranslationRepository.find = jest
          .fn()
          .mockResolvedValue({ items: [exerciseTranslationDomain], count: 1 });

        exerciseTranslationRepository.findOneById = jest
          .fn()
          .mockResolvedValue(exerciseTranslationDomain);

        exerciseTranslationRepository.findOneByIdAndExerciseId = jest
          .fn()
          .mockResolvedValue(exerciseTranslationDomain);

        exerciseTranslationRepository.update = jest
          .fn()
          .mockResolvedValue(right(true));

        exerciseTranslationRepository.delete = jest
          .fn()
          .mockResolvedValue(right(true));
      }

      return exerciseTranslationRepository;
    },
    inject: [],
  } as Provider;
};

export default getExerciseTranslationRepositoryProvider;
