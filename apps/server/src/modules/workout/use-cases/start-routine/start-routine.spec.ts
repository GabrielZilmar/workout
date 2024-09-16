import {
  InternalServerErrorException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { Set } from '~/modules/set/entities/set.entity';
import SetMapper from '~/modules/set/mappers/set.mapper';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { Workout } from '~/modules/workout/entities/workout.entity';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import { StartRoutine } from '~/modules/workout/use-cases/start-routine';

jest.mock('~/services/database/typeorm/config/data-source');

type GetModuleTestParams = {
  workoutRepositoryProvider?: Provider;
  dataSourceProvider?: Provider;
};

describe('StartRoutine', () => {
  const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
  const workoutExerciseDomain =
    WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
      workoutDomain: workoutDomain,
      workoutId: workoutDomain.id?.toString() as string,
    });
  const setDomain = SetDomainMock.mountSetDomain({
    workoutExerciseId: workoutExerciseDomain.id?.toString() as string,
  });
  let module: TestingModule;

  const getDataSourceRepository = (repo: unknown) => {
    let repositoryReturn: Workout | WorkoutExercise | Set | undefined;
    switch (repo) {
      case Workout:
        const workoutMapper = new WorkoutMapper(new UserMapper());
        repositoryReturn = workoutMapper.toPersistence(
          workoutDomain,
        ) as Workout;
        break;
      case WorkoutExercise:
        const workoutExerciseMapper = new WorkoutExerciseMapper(
          new WorkoutMapper(new UserMapper()),
          new ExerciseMapper(new MuscleMapper()),
          new SetMapper(),
        );
        repositoryReturn = workoutExerciseMapper.toPersistence(
          workoutExerciseDomain,
        ) as WorkoutExercise;
        break;
      case Set:
        const setMapper = new SetMapper();
        repositoryReturn = setMapper.toPersistence(setDomain) as Set;
        break;
    }

    return repositoryReturn;
  };

  const getDataSourceProvider = () =>
    ({
      provide: DataSource,
      useValue: {
        manager: {
          transaction: jest.fn().mockImplementation((callback) => {
            return callback({
              getRepository: jest.fn().mockImplementation((repo: unknown) => {
                const repositoryReturn = getDataSourceRepository(repo);
                return {
                  save: jest.fn().mockReturnValue(repositoryReturn),
                  create: jest.fn().mockReturnValue(repositoryReturn),
                  find: jest.fn().mockReturnValue([repositoryReturn]),
                  findOneById: jest.fn().mockReturnValue(repositoryReturn),
                };
              }),
            });
          }),
        },
      },
    } as Provider);

  const getModuleTest = async ({
    workoutRepositoryProvider = getWorkoutRepositoryProvider({ workoutDomain }),
    dataSourceProvider,
  }: GetModuleTestParams = {}) => {
    if (!dataSourceProvider) {
      dataSourceProvider = getDataSourceProvider();
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        workoutRepositoryProvider,
        dataSourceProvider,
        UserMapper,
        ExerciseMapper,
        MuscleMapper,
        WorkoutMapper,
        WorkoutExerciseMapper,
        SetMapper,
        StartRoutine,
      ],
    }).compile();
  };

  beforeEach(async () => {
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should start a routine', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);

    const result = await startRoutine.execute({
      workoutId: workoutDomain.id?.toString() as string,
      userId: workoutDomain.userId?.toString() as string,
    });

    expect(result).toEqual(workoutDomain.toDto().value);
  });

  it('Should not start a routine if workout was not found', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);
    jest
      .spyOn(startRoutine['workoutRepository'], 'findOneById')
      .mockResolvedValue(null);

    const invalidId = 'invalid-id';
    await expect(
      startRoutine.execute({
        workoutId: invalidId,
        userId: workoutDomain.userId?.toString() as string,
      }),
    ).rejects.toThrow(
      new NotFoundException(
        WorkoutUseCaseError.messages.workoutNotFound(invalidId),
      ),
    );
  });

  it('Should not start a routine if user is not the owner and workout is private', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);

    const workoutDomainPrivate = WorkoutDomainMock.mountWorkoutDomain({
      isPrivate: true,
      userDomain: await UserDomainMock.mountUserDomain(),
    });
    jest
      .spyOn(startRoutine['workoutRepository'], 'findOneById')
      .mockResolvedValue(workoutDomainPrivate);

    await expect(
      startRoutine.execute({
        workoutId: workoutDomainPrivate.id?.toString() as string,
        userId: uuid(),
      }),
    ).rejects.toThrow(
      new NotFoundException(
        WorkoutUseCaseError.messages.cannotStartRoutineFromThisWorkout,
      ),
    );
  });

  it('Should not start a routine if workout domain id is invalid', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);
    const workoutDomainWithoutId = WorkoutDomainMock.mountWorkoutDomain({
      withoutId: true,
    });
    jest
      .spyOn(startRoutine['workoutRepository'], 'findOneById')
      .mockResolvedValue(workoutDomainWithoutId);

    await expect(
      startRoutine.execute({
        workoutId: uuid(),
        userId: workoutDomain.userId?.toString() as string,
      }),
    ).rejects.toThrow(
      new InternalServerErrorException(
        WorkoutUseCaseError.messages.workoutDomainIdNotFound,
      ),
    );
  });

  it('Should not start a routine if workout repository fails', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);

    const mockError = new Error('Mock error');
    jest
      .spyOn(startRoutine['dataSource'].manager, 'transaction')
      .mockImplementation((callback: any) => {
        return callback({
          getRepository: jest.fn().mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(mockError),
            create: jest.fn().mockReturnValue({} as Workout),
          })),
        });
      });

    await expect(
      startRoutine.execute({
        workoutId: uuid(),
        userId: workoutDomain.userId?.toString() as string,
      }),
    ).rejects.toThrow(new InternalServerErrorException(mockError.message));
  });

  it('Should not start a routine if workout exercise repository fails', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);

    const mockError = new Error('Mock error');
    jest
      .spyOn(startRoutine['dataSource'].manager, 'transaction')
      .mockImplementation((callback: any) => {
        return callback({
          getRepository: jest.fn().mockImplementation((repo: unknown) => {
            if (repo === WorkoutExercise) {
              return {
                find: jest.fn().mockRejectedValue(mockError),
              };
            }

            return {
              save: jest.fn().mockReturnValue({}),
              create: jest.fn().mockReturnValue({}),
            };
          }),
        });
      });

    await expect(
      startRoutine.execute({
        workoutId: workoutDomain.id?.toString() as string,
        userId: workoutDomain.userId?.toString() as string,
      }),
    ).rejects.toThrow(new InternalServerErrorException(mockError.message));
  });

  it('Should not start a routine if set repository fails', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);

    const mockError = new Error('Mock error');
    jest
      .spyOn(startRoutine['dataSource'].manager, 'transaction')
      .mockImplementation((callback: any) => {
        return callback({
          getRepository: jest.fn().mockImplementation((repo: unknown) => {
            if (repo === Set) {
              return {
                find: jest.fn().mockRejectedValue(mockError),
              };
            }

            if (repo === WorkoutExercise) {
              const workoutExerciseMapper = new WorkoutExerciseMapper(
                new WorkoutMapper(new UserMapper()),
                new ExerciseMapper(new MuscleMapper()),
                new SetMapper(),
              );
              const repositoryReturn = workoutExerciseMapper.toPersistence(
                workoutExerciseDomain,
              ) as WorkoutExercise;
              return {
                find: jest.fn().mockReturnValue([repositoryReturn]),
                save: jest.fn().mockReturnValue(repositoryReturn),
                create: jest.fn().mockReturnValue(repositoryReturn),
              };
            }

            const workoutMapper = new WorkoutMapper(new UserMapper());
            const repositoryReturn = workoutMapper.toPersistence(
              workoutDomain,
            ) as Workout;
            return {
              save: jest.fn().mockReturnValue(repositoryReturn),
              create: jest.fn().mockReturnValue(repositoryReturn),
              find: jest.fn().mockReturnValue([repositoryReturn]),
            };
          }),
        });
      });

    await expect(
      startRoutine.execute({
        workoutId: workoutDomain.id?.toString() as string,
        userId: workoutDomain.userId?.toString() as string,
      }),
    ).rejects.toThrow(new InternalServerErrorException(mockError.message));
  });

  it('Should not start a routine if to domain throw', async () => {
    const startRoutine = module.get<StartRoutine>(StartRoutine);

    const mockError = new Error('Mock error');
    jest
      .spyOn(startRoutine as any, 'toDomainOrThrow')
      .mockRejectedValue(mockError);

    await expect(
      startRoutine.execute({
        workoutId: workoutDomain.id?.toString() as string,
        userId: workoutDomain.userId?.toString() as string,
      }),
    ).rejects.toThrow(new InternalServerErrorException(mockError.message));
  });
});
