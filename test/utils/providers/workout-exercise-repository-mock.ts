import { Provider } from '@nestjs/common';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import { right } from '~/shared/either';

type GetWorkoutExerciseRepositoryProviderParams = {
  workoutExerciseRepository?: WorkoutExerciseRepository;
  workoutExerciseDomain?: WorkoutExerciseDomain;
};

const getWorkoutExerciseRepositoryProvider = ({
  workoutExerciseRepository,
  workoutExerciseDomain,
}: GetWorkoutExerciseRepositoryProviderParams = {}) => {
  if (workoutExerciseDomain === undefined) {
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain();
  }

  return {
    provide: WorkoutExerciseRepository,
    useFactory: () => {
      if (!workoutExerciseRepository) {
        workoutExerciseRepository = new WorkoutExerciseRepository(
          new WorkoutExerciseMapper(),
        ) as jest.Mocked<InstanceType<typeof WorkoutExerciseRepository>>;

        workoutExerciseRepository.create = jest
          .fn()
          .mockResolvedValue(right(workoutExerciseDomain));

        workoutExerciseRepository.find = jest
          .fn()
          .mockResolvedValue({ items: [workoutExerciseDomain], count: 1 });

        workoutExerciseRepository.findUsersWorkoutExercises = jest
          .fn()
          .mockResolvedValue({ items: [workoutExerciseDomain], count: 1 });

        workoutExerciseRepository.findOneById = jest
          .fn()
          .mockResolvedValue(workoutExerciseDomain);

        workoutExerciseRepository.findOne = jest
          .fn()
          .mockResolvedValue(workoutExerciseDomain);

        workoutExerciseRepository.update = jest
          .fn()
          .mockResolvedValue(right(true));

        workoutExerciseRepository.delete = jest
          .fn()
          .mockResolvedValue(right(true));
      }

      return workoutExerciseRepository;
    },
    inject: [],
  } as Provider;
};

export default getWorkoutExerciseRepositoryProvider;
