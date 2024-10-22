import { NotFoundException, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import getSetRepositoryProvider from 'test/utils/providers/set-repository-mock';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import { ExerciseProgress } from '~/modules/exercise/use-cases/progress-history';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import SetDomain from '~/modules/set/domain/set.domain';
import SetMapper from '~/modules/set/mappers/set.mapper';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';

type GetModuleTestParams = {
  exerciseRepositoryProvider?: Provider;
  setRepositoryProvider?: Provider;
};

describe('Progress history', () => {
  let exerciseDomain: ExerciseDomain;
  let workoutDomain: WorkoutDomain;
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let setDomain: SetDomain;
  let module: TestingModule;

  const getModuleTest = async ({
    exerciseRepositoryProvider = getExerciseRepositoryProvider({
      exerciseDomain,
    }),
    setRepositoryProvider = getSetRepositoryProvider({ setDomain }),
  }: GetModuleTestParams = {}) =>
    Test.createTestingModule({
      imports: [],
      providers: [
        exerciseRepositoryProvider,
        setRepositoryProvider,
        ExerciseMapper,
        WorkoutMapper,
        WorkoutExerciseMapper,
        MuscleMapper,
        UserMapper,
        SetMapper,
        ExerciseProgress,
      ],
    }).compile();

  beforeEach(async () => {
    exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain,
        workoutId: workoutDomain.id?.toValue() as string,
        exerciseDomain,
        exerciseId: exerciseDomain.id?.toValue() as string,
      });
    setDomain = SetDomainMock.mountSetDomain({
      workoutExerciseDomain,
      workoutExerciseId: workoutExerciseDomain.id?.toValue() as string,
    });
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should return exercise progress', async () => {
    const exerciseProgress = module.get<ExerciseProgress>(ExerciseProgress);

    const progress = await exerciseProgress.execute({
      userId: workoutDomain.userId,
      exerciseId: exerciseDomain.id?.toValue() as string,
    });

    expect(progress).toEqual({
      sales: [
        {
          [setDomain.createdAt.getDateStringValue()]: setDomain.setWeight.value,
        },
      ],
    });
  });

  it('Should throw error if exercise was not found', async () => {
    const exerciseProgress = module.get<ExerciseProgress>(ExerciseProgress);
    jest
      .spyOn(exerciseProgress['exerciseRepository'], 'findOneById')
      .mockResolvedValue(null);

    await expect(
      exerciseProgress.execute({
        userId: workoutDomain.userId,
        exerciseId: exerciseDomain.id?.toValue() as string,
      }),
    ).rejects.toThrow(
      new NotFoundException(
        ExerciseUseCaseError.messages.exerciseNotFound(
          exerciseDomain.id?.toValue() as string,
        ),
      ),
    );
  });
});
