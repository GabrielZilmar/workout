import { Provider } from '@nestjs/common';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import { right } from '~/shared/either';

type GetExerciseRepositoryProviderParams = {
  exerciseRepository?: ExerciseRepository;
  exerciseDomain?: ExerciseDomain | null;
};

const getExerciseRepositoryProvider = ({
  exerciseRepository,
  exerciseDomain,
}: GetExerciseRepositoryProviderParams = {}) => {
  if (exerciseDomain === undefined) {
    exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
  }

  return {
    provide: ExerciseRepository,
    useFactory: () => {
      if (!exerciseRepository) {
        exerciseRepository = new ExerciseRepository(
          new ExerciseMapper(),
        ) as jest.Mocked<InstanceType<typeof ExerciseRepository>>;

        exerciseRepository.create = jest
          .fn()
          .mockResolvedValue(right(exerciseDomain));

        exerciseRepository.find = jest
          .fn()
          .mockResolvedValue({ items: [exerciseDomain], count: 1 });

        exerciseRepository.findOneById = jest
          .fn()
          .mockResolvedValue(exerciseDomain);

        exerciseRepository.update = jest.fn().mockResolvedValue(right(true));

        exerciseRepository.delete = jest.fn().mockResolvedValue(right(true));
      }

      return exerciseRepository;
    },
    inject: [],
  } as Provider;
};

export default getExerciseRepositoryProvider;
