import { HttpException, HttpStatus, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getSetRepositoryProvider from 'test/utils/providers/set-repository-mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import SetDomain from '~/modules/set/domain/set.domain';
import { ListSetByWorkoutExerciseId } from '~/modules/set/domain/use-cases/list-set-by-workout-exercise';
import { SetDtoError } from '~/modules/set/dto/errors/set-dto-errors';
import SetMapper from '~/modules/set/mappers/set.mapper';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';

type GetModuleTestParams = {
  setRepositoryProvider?: Provider;
  workoutExerciseRepositoryProvider?: Provider;
};

describe('ListByWorkoutExercise use case', () => {
  let workoutDomain: WorkoutDomain;
  let setDomain: SetDomain;
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let module: TestingModule;

  beforeEach(async () => {
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutId: workoutDomain.id?.toValue() as string,
        workoutDomain,
      });
    setDomain = SetDomainMock.mountSetDomain({
      workoutExerciseId: workoutExerciseDomain.id?.toValue() as string,
    });
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async ({
    setRepositoryProvider,
    workoutExerciseRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!setRepositoryProvider) {
      setRepositoryProvider = getSetRepositoryProvider({
        setDomain,
      });
    }

    if (!workoutExerciseRepositoryProvider) {
      workoutExerciseRepositoryProvider = getWorkoutExerciseRepositoryProvider({
        workoutExerciseDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        setRepositoryProvider,
        workoutExerciseRepositoryProvider,
        SetMapper,
        WorkoutExerciseMapper,
        WorkoutMapper,
        ExerciseMapper,
        UserMapper,
        MuscleMapper,
        ListSetByWorkoutExerciseId,
      ],
    }).compile();
  };

  it('Should list by workout exercise', async () => {
    const listSetByWorkoutExerciseId = module.get<ListSetByWorkoutExerciseId>(
      ListSetByWorkoutExerciseId,
    );

    const sets = await listSetByWorkoutExerciseId.execute({
      userId: 'userId',
      workoutExerciseId: workoutExerciseDomain.id?.toValue() as string,
      skip: 0,
      take: 10,
    });

    expect(sets).toEqual({
      items: [setDomain.toDto().value],
      count: 1,
    });
  });

  it('Should not list by workout exercise if set dto fails', async () => {
    const listSetByWorkoutExerciseId = module.get<ListSetByWorkoutExerciseId>(
      ListSetByWorkoutExerciseId,
    );

    const setDomainWithoutId = SetDomainMock.mountSetDomain({
      withoutId: true,
    });
    jest
      .spyOn(
        listSetByWorkoutExerciseId['setRepository'],
        'findByWorkoutExerciseId',
      )
      .mockResolvedValue({ items: [setDomainWithoutId], count: 1 });

    await expect(
      listSetByWorkoutExerciseId.execute({
        userId: 'userId',
        workoutExerciseId: workoutExerciseDomain.id?.toValue() as string,
        skip: 0,
        take: 10,
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          message: SetDtoError.messages.missingId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
