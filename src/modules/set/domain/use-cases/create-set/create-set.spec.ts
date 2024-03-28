import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getSetRepositoryProvider from 'test/utils/providers/set-repository-mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import { SetDomainError } from '~/modules/set/domain/errors';
import SetDomain from '~/modules/set/domain/set.domain';
import { CreateSet } from '~/modules/set/domain/use-cases/create-set';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import SetMapper from '~/modules/set/mappers/set.mapper';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  setRepositoryProvider?: Provider;
  workoutExerciseRepositoryProvider?: Provider;
};

describe('CreateSet use case', () => {
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
        CreateSet,
      ],
    }).compile();
  };

  it('should create a set', async () => {
    const createSet = await module.resolve<CreateSet>(CreateSet);
    const set = await createSet.execute({
      userId: workoutDomain.userId,
      workoutExerciseId: setDomain.workoutExerciseId,
      numReps: 10,
      setWeight: 10,
      numDrops: 10,
    });

    expect(set).toEqual(setDomain.toDto().value);
  });

  it('Should not create a set if workout exercise does not exist', async () => {
    const createSet = await module.resolve<CreateSet>(CreateSet);
    jest
      .spyOn(createSet['workoutExerciseRepository'], 'findOneByIdWithRelations')
      .mockResolvedValue(null);

    await expect(
      createSet.execute({
        userId: workoutDomain.userId,
        workoutExerciseId: setDomain.workoutExerciseId,
        numReps: 10,
        setWeight: 10,
        numDrops: 10,
      }),
    ).rejects.toThrow(
      new NotFoundException({
        message: SetUseCaseError.messages.workoutExerciseNotFound(
          setDomain.workoutExerciseId,
        ),
      }),
    );
  });

  it('Should not create a set if workout does not belong to user', async () => {
    const createSet = await module.resolve<CreateSet>(CreateSet);

    await expect(
      createSet.execute({
        userId: 'forbidden-user-id',
        workoutExerciseId: setDomain.workoutExerciseId,
        numReps: 10,
        setWeight: 10,
        numDrops: 10,
      }),
    ).rejects.toThrow(
      new ForbiddenException({
        message: SetUseCaseError.messages.workoutNotBelongToUser(
          workoutExerciseDomain.workoutId,
        ),
      }),
    );
  });

  it('Should not create a set if set domain is invalid', async () => {
    const createSet = await module.resolve<CreateSet>(CreateSet);

    await expect(
      createSet.execute({
        userId: workoutDomain.userId,
        workoutExerciseId: '',
        numReps: 10,
        setWeight: 10,
        numDrops: 10,
      }),
    ).rejects.toThrow(
      new HttpException(
        SetDomainError.messages.missingProps,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not create a set if set repository fails', async () => {
    const createSet = await module.resolve<CreateSet>(CreateSet);
    const errorMock = RepositoryError.create('Error', 500);
    jest
      .spyOn(createSet['setRepository'], 'create')
      .mockResolvedValue(left(errorMock));

    await expect(
      createSet.execute({
        userId: workoutDomain.userId,
        workoutExerciseId: setDomain.workoutExerciseId,
        numReps: 10,
        setWeight: 10,
        numDrops: 10,
      }),
    ).rejects.toThrow(new HttpException(errorMock.message, errorMock.code));
  });

  it('Should not create a set if dto fails', async () => {
    const createSet = await module.resolve<CreateSet>(CreateSet);
    const errorMock = RepositoryError.create('Error', 500);
    jest.spyOn(setDomain, 'toDto').mockReturnValue(left(errorMock));

    await expect(
      createSet.execute({
        userId: workoutDomain.userId,
        workoutExerciseId: setDomain.workoutExerciseId,
        numReps: 10,
        setWeight: 10,
        numDrops: 10,
      }),
    ).rejects.toThrow(new HttpException(errorMock.message, errorMock.code));
  });
});
