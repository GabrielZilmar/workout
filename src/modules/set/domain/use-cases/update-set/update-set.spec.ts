import {
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getSetRepositoryProvider from 'test/utils/providers/set-repository-mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import SetDomain from '~/modules/set/domain/set.domain';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import { UpdateSet } from '~/modules/set/domain/use-cases/update-set';
import SetMapper from '~/modules/set/mappers/set.mapper';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left } from '~/shared/either';

describe('UpdateSet use case', () => {
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

  const getModuleTest = async () => {
    const setRepositoryProvider = getSetRepositoryProvider({
      setDomain,
    });

    const workoutExerciseRepositoryProvider =
      getWorkoutExerciseRepositoryProvider({
        workoutExerciseDomain,
      });

    return Test.createTestingModule({
      imports: [],
      providers: [
        setRepositoryProvider,
        workoutExerciseRepositoryProvider,
        SetMapper,
        UpdateSet,
      ],
    }).compile();
  };

  it('Should update a set', async () => {
    const updateSetUseCase = module.get<UpdateSet>(UpdateSet);

    const updatedSet = await updateSetUseCase.execute({
      id: setDomain.id?.toValue() as string,
      userId: workoutDomain.userId,
      numReps: 10,
      setWeight: 20,
      numDrops: 1,
    });
    expect(updatedSet).toBe(true);
  });

  it('Should not update a set if it does not exist', async () => {
    const updateSetUseCase = module.get<UpdateSet>(UpdateSet);

    jest
      .spyOn(updateSetUseCase['setRepository'], 'findOneById')
      .mockResolvedValueOnce(null);

    const invalidId = 'invalid-set-id';
    await expect(
      updateSetUseCase.execute({
        id: invalidId,
        userId: workoutDomain.userId,
        numReps: 1,
      }),
    ).rejects.toThrowError(
      new NotFoundException(SetUseCaseError.messages.setNotFound(invalidId)),
    );
  });

  it('Should not update a set if workout exercise does not exist', async () => {
    const updateSetUseCase = module.get<UpdateSet>(UpdateSet);

    jest
      .spyOn(
        updateSetUseCase['workoutExerciseRepository'],
        'findOneByIdWithRelations',
      )
      .mockResolvedValue(null);

    await expect(
      updateSetUseCase.execute({
        id: setDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
        numReps: 1,
      }),
    ).rejects.toThrowError(
      new NotFoundException(
        SetUseCaseError.messages.workoutExerciseNotFound(
          setDomain.workoutExerciseId,
        ),
      ),
    );
  });

  it('Should not update a set if workout does not belong to user', async () => {
    const updateSetUseCase = module.get<UpdateSet>(UpdateSet);

    await expect(
      updateSetUseCase.execute({
        id: setDomain.id?.toValue() as string,
        userId: 'forbidden-user-id',
        numReps: 1,
      }),
    ).rejects.toThrowError(
      new ForbiddenException(
        SetUseCaseError.messages.workoutNotBelongToUser(
          workoutExerciseDomain.workoutId,
        ),
      ),
    );
  });

  it('Should not update a set if set domain is invalid', async () => {
    const updateSetUseCase = module.get<UpdateSet>(UpdateSet);

    const errorMock = SetUseCaseError.create('Error', 400);
    jest.spyOn(setDomain, 'update').mockImplementation(() => left(errorMock));

    await expect(
      updateSetUseCase.execute({
        id: setDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
        numReps: 1,
      }),
    ).rejects.toThrowError(
      new HttpException(errorMock.message, errorMock.code),
    );
  });

  it('Should not update a set if set repository update fails', async () => {
    const updateSetUseCase = module.get<UpdateSet>(UpdateSet);

    const errorMock = RepositoryError.create('Error', 400);
    jest
      .spyOn(updateSetUseCase['setRepository'], 'update')
      .mockResolvedValue(left(errorMock));

    await expect(
      updateSetUseCase.execute({
        id: setDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
        numReps: 1,
      }),
    ).rejects.toThrowError(
      new HttpException(errorMock.message, errorMock.code),
    );
  });
});
