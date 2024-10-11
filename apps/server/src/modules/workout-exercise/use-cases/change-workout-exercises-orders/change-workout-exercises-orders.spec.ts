import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import SetMapper from '~/modules/set/mappers/set.mapper';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { ChangeWorkoutExercisesOrders } from '~/modules/workout-exercise/use-cases/change-workout-exercises-orders';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';

jest.mock('~/services/database/typeorm/config/data-source');

type GetModuleTestParams = {
  dataSourceProvider?: Provider;
};

describe('Change workout exercises orders', () => {
  let userDomain: UserDomain;
  let workoutDomain: WorkoutDomain;
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let module: TestingModule;

  const getDataSourceRepository = () => {
    const workoutExerciseMapper = new WorkoutExerciseMapper(
      new WorkoutMapper(new UserMapper()),
      new ExerciseMapper(new MuscleMapper()),
      new SetMapper(),
    );

    const repositoryReturn = workoutExerciseMapper.toPersistence(
      workoutExerciseDomain,
    ) as WorkoutExercise;

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
        ChangeWorkoutExercisesOrders,
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
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should update workout exercise orders', async () => {
    const changeWorkoutExercisesOrders =
      module.get<ChangeWorkoutExercisesOrders>(ChangeWorkoutExercisesOrders);

    const result = await changeWorkoutExercisesOrders.execute({
      items: [
        {
          id: workoutExerciseDomain.id?.toValue() as string,
          order: 4,
        },
      ],
      userId: userDomain.id?.toValue() as string,
    });

    expect(result).toBeTruthy();
  });

  it('Should throw if workout exercise was not found', async () => {
    const changeWorkoutExercisesOrders =
      module.get<ChangeWorkoutExercisesOrders>(ChangeWorkoutExercisesOrders);

    const dataSource = module.get<DataSource>(DataSource);
    dataSource.manager.transaction = jest
      .fn()
      .mockImplementation((callback) => {
        return callback({
          getRepository: jest.fn().mockImplementation(() => {
            const repo = getDataSourceRepository();
            return {
              ...repo,
              findOne: jest.fn().mockReturnValue(null),
            };
          }),
        });
      });

    await expect(
      changeWorkoutExercisesOrders.execute({
        items: [
          {
            id: workoutExerciseDomain.id?.toValue() as string,
            order: 4,
          },
        ],
        userId: userDomain.id?.toValue() as string,
      }),
    ).rejects.toThrow(
      new NotFoundException(
        WorkoutUseCaseError.messages.workoutNotFound(
          workoutExerciseDomain.id?.toValue() as string,
        ),
      ),
    );
  });

  it('Should throw if workout does not belongs to user', async () => {
    const changeWorkoutExercisesOrders =
      module.get<ChangeWorkoutExercisesOrders>(ChangeWorkoutExercisesOrders);

    await expect(
      changeWorkoutExercisesOrders.execute({
        items: [
          {
            id: workoutExerciseDomain.id?.toValue() as string,
            order: 4,
          },
        ],
        userId: v4(),
      }),
    ).rejects.toThrow(
      new ForbiddenException(
        WorkoutUseCaseError.messages.cannotUpdateOthersWorkout,
      ),
    );
  });

  it('Should throw if update fails', async () => {
    const changeWorkoutExercisesOrders =
      module.get<ChangeWorkoutExercisesOrders>(ChangeWorkoutExercisesOrders);

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
      changeWorkoutExercisesOrders.execute({
        items: [
          {
            id: workoutExerciseDomain.id?.toValue() as string,
            order: 4,
          },
        ],
        userId: userDomain.id?.toValue() as string,
      }),
    ).rejects.toThrow(
      new InternalServerErrorException({
        message: RepositoryError.messages.updateError,
      }),
    );
  });
});
