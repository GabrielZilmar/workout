import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import SetDomain from '~/modules/set/domain/set.domain';
import { ChangeManySetOrders } from '~/modules/set/domain/use-cases/change-many-set-orders';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import { Set } from '~/modules/set/entities/set.entity';
import SetMapper from '~/modules/set/mappers/set.mapper';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';

jest.mock('~/services/database/typeorm/config/data-source');

type GetModuleTestParams = {
  dataSourceProvider?: Provider;
};

describe('Change many set orders', () => {
  let userDomain: UserDomain;
  let workoutDomain: WorkoutDomain;
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let setDomain: SetDomain;
  let module: TestingModule;

  const getDataSourceRepository = () => {
    const setMapper = new SetMapper(
      new WorkoutExerciseMapper(
        new WorkoutMapper(new UserMapper()),
        new ExerciseMapper(new MuscleMapper()),
        new SetMapper(),
      ),
    );

    const repositoryReturn = setMapper.toPersistence(setDomain) as Set;

    return {
      save: jest.fn().mockReturnValue(repositoryReturn),
      create: jest.fn().mockReturnValue(repositoryReturn),
      find: jest.fn().mockReturnValue([repositoryReturn]),
      findOne: jest.fn().mockReturnValue(repositoryReturn),
      update: jest.fn().mockReturnValue({ affected: true }),
    };
  };

  const getDataSourceProvider = () =>
    ({
      provide: DataSource,
      useValue: {
        manager: {
          transaction: jest.fn().mockImplementation((callback) => {
            return callback({
              getRepository: jest
                .fn()
                .mockImplementation(() => getDataSourceRepository()),
            });
          }),
        },
      },
    } as Provider);

  const getModuleTest = async ({
    dataSourceProvider,
  }: GetModuleTestParams = {}) => {
    if (!dataSourceProvider) {
      dataSourceProvider = getDataSourceProvider();
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        dataSourceProvider,
        UserMapper,
        ExerciseMapper,
        MuscleMapper,
        WorkoutMapper,
        WorkoutExerciseMapper,
        SetMapper,
        ChangeManySetOrders,
      ],
    }).compile();
  };

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      userDomain,
      userId: userDomain.id?.toValue() as string,
    });
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain: workoutDomain,
        workoutId: workoutDomain.id?.toString() as string,
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

  it('Should update set orders', async () => {
    const changeManySetOrders =
      module.get<ChangeManySetOrders>(ChangeManySetOrders);

    const result = await changeManySetOrders.execute({
      items: [
        {
          id: setDomain.id?.toValue() as string,
          order: 4,
        },
      ],
      userId: userDomain.id?.toValue() as string,
    });

    expect(result).toBeTruthy();
  });

  it('Should throw if set was not found', async () => {
    const changeManySetOrders =
      module.get<ChangeManySetOrders>(ChangeManySetOrders);

    const dataSource = module.get<DataSource>(DataSource);
    dataSource.manager.transaction = jest
      .fn()
      .mockImplementation((callback) => {
        return callback({
          getRepository: jest.fn().mockImplementation(() => {
            const repo = getDataSourceRepository();
            return { ...repo, findOne: jest.fn().mockReturnValue(null) };
          }),
        });
      });

    await expect(
      changeManySetOrders.execute({
        items: [{ id: setDomain.id?.toValue() as string, order: 4 }],
        userId: userDomain.id?.toValue() as string,
      }),
    ).rejects.toThrow(
      new NotFoundException(
        SetUseCaseError.messages.setNotFound(setDomain.id?.toValue() as string),
      ),
    );
  });

  it('Should throw if set does not belongs to user', async () => {
    const changeManySetOrders =
      module.get<ChangeManySetOrders>(ChangeManySetOrders);

    await expect(
      changeManySetOrders.execute({
        items: [{ id: setDomain.id?.toValue() as string, order: 4 }],
        userId: v4(),
      }),
    ).rejects.toThrow(
      new ForbiddenException(
        SetUseCaseError.messages.cannotUpdateOthersWorkout,
      ),
    );
  });

  it('Should throw if update fails', async () => {
    const changeManySetOrders =
      module.get<ChangeManySetOrders>(ChangeManySetOrders);

    const dataSource = module.get<DataSource>(DataSource);
    dataSource.manager.transaction = jest
      .fn()
      .mockImplementation((callback) => {
        return callback({
          getRepository: jest.fn().mockImplementation(() => {
            const repo = getDataSourceRepository();
            return {
              ...repo,
              update: jest.fn().mockReturnValue({ affected: 0 }),
            };
          }),
        });
      });

    await expect(
      changeManySetOrders.execute({
        items: [{ id: setDomain.id?.toValue() as string, order: 4 }],
        userId: userDomain.id?.toValue() as string,
      }),
    ).rejects.toThrow(
      new InternalServerErrorException({
        message: RepositoryError.messages.updateError,
      }),
    );
  });
});
