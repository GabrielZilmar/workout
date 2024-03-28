import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getSetRepositoryProvider from 'test/utils/providers/set-repository-mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import SetDomain from '~/modules/set/domain/set.domain';
import { DeleteSet } from '~/modules/set/domain/use-cases/delete-set';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import SetMapper from '~/modules/set/mappers/set.mapper';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left } from '~/shared/either';

describe('DeleteSet use case', () => {
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
        DeleteSet,
      ],
    }).compile();
  };

  it('Should delete a set', async () => {
    const deleteSetUseCase = module.get<DeleteSet>(DeleteSet);

    const deletedSet = await deleteSetUseCase.execute({
      id: setDomain.id?.toValue() as string,
      userId: workoutDomain.userId,
    });
    expect(deletedSet).toBe(true);
  });

  it('Should not delete a set if it does not exist', async () => {
    const deleteSetUseCase = module.get<DeleteSet>(DeleteSet);

    jest
      .spyOn(deleteSetUseCase['setRepository'], 'findOneById')
      .mockResolvedValue(null);

    const notFoundId = 'not-found-id';
    await expect(
      deleteSetUseCase.execute({
        id: notFoundId,
        userId: workoutDomain.userId,
      }),
    ).rejects.toThrowError(
      new NotFoundException(SetUseCaseError.messages.setNotFound(notFoundId)),
    );
  });

  it('Should not delete a set if workout exercise does not exist', async () => {
    const deleteSetUseCase = module.get<DeleteSet>(DeleteSet);

    jest
      .spyOn(
        deleteSetUseCase['workoutExerciseRepository'],
        'findOneByIdWithRelations',
      )
      .mockResolvedValue(null);

    await expect(
      deleteSetUseCase.execute({
        id: setDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
      }),
    ).rejects.toThrowError(
      new NotFoundException(
        SetUseCaseError.messages.workoutExerciseNotFound(
          setDomain.workoutExerciseId,
        ),
      ),
    );
  });

  it('Should not delete a set if workout does not belong to user', async () => {
    const deleteSetUseCase = module.get<DeleteSet>(DeleteSet);

    await expect(
      deleteSetUseCase.execute({
        id: setDomain.id?.toValue() as string,
        userId: 'forbidden-user-id',
      }),
    ).rejects.toThrowError(
      new NotFoundException({
        message: SetUseCaseError.messages.workoutNotBelongToUser(
          workoutExerciseDomain.workoutId,
        ),
      }),
    );
  });

  it('Should not delete a set if repository fails', async () => {
    const deleteSetUseCase = module.get<DeleteSet>(DeleteSet);

    const errorTest = RepositoryError.create('Test throw');
    jest
      .spyOn(deleteSetUseCase['setRepository'], 'delete')
      .mockResolvedValue(left(errorTest));

    await expect(
      deleteSetUseCase.execute({
        id: setDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
      }),
    ).rejects.toThrowError(
      new HttpException(errorTest.message, errorTest.code),
    );
  });
});
