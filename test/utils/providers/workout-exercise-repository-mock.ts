import { Provider } from '@nestjs/common';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
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
    const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    const exerciseDomain = ExerciseDomainMock.mountExerciseDomain();

    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain,
        exerciseDomain,
        workoutId: workoutDomain.id?.toValue() as string,
        exerciseId: exerciseDomain.id?.toValue() as string,
      });
  }

  return {
    provide: WorkoutExerciseRepository,
    useFactory: () => {
      if (!workoutExerciseRepository) {
        workoutExerciseRepository = new WorkoutExerciseRepository(
          new WorkoutExerciseMapper(new WorkoutMapper(), new ExerciseMapper()),
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

        workoutExerciseRepository.findOneByIdWithRelations = jest
          .fn()
          .mockResolvedValue(workoutExerciseDomain);
      }

      return workoutExerciseRepository;
    },
    inject: [],
  } as Provider;
};

export default getWorkoutExerciseRepositoryProvider;
