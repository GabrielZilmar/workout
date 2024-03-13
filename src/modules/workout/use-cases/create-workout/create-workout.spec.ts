import { BadRequestException, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import getUserRepositoryProvider from 'test/utils/providers/user-repository';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

type GetModuleTestParams = {
  userRepositoryProvider?: Provider;
  workoutRepositoryProvider?: Provider;
};

describe('CreateWorkout use case', () => {
  let userDomain: UserDomain;
  let workoutDomain: WorkoutDomain;
  const userMapper = new UserMapper();
  let module: TestingModule;

  beforeAll(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      userId: userDomain.id?.toString(),
    });
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getUserRepositoryMock = () => {
    const findOneByIdMock = jest.fn().mockResolvedValue(userDomain);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findOneById = findOneByIdMock;

    return userRepositoryMock;
  };

  const getModuleTest = async ({
    userRepositoryProvider,
    workoutRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!userRepositoryProvider) {
      userRepositoryProvider = await getUserRepositoryProvider({
        userRepositoryMock: getUserRepositoryMock(),
        userDomain,
      });
    }

    if (!workoutRepositoryProvider) {
      workoutRepositoryProvider = getWorkoutRepositoryProvider({
        workoutDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        userRepositoryProvider,
        workoutRepositoryProvider,
        UserMapper,
        WorkoutMapper,
        CreateWorkout,
      ],
    }).compile();
  };

  it('Should create a workout', async () => {
    const createWorkoutUseCase = module.get<CreateWorkout>(CreateWorkout);
    const createWorkoutParams = WorkoutDomainMock.getWorkoutCreateParams();

    const workoutCreated = await createWorkoutUseCase.execute({
      ...createWorkoutParams,
      userId: userDomain.id?.toString() as string,
    });

    expect(workoutCreated).toEqual(workoutDomain.toDto().value);
  });

  it('Should not create a workout if user does not exist', async () => {
    const userRepositoryMock = getUserRepositoryMock();
    userRepositoryMock.findOneById.mockResolvedValue(null);
    module = await getModuleTest({
      userRepositoryProvider: await getUserRepositoryProvider({
        userRepositoryMock,
        userDomain,
      }),
    });

    const userId = userDomain.id?.toString() as string;
    const createWorkoutUseCase = module.get<CreateWorkout>(CreateWorkout);
    const createWorkoutParams = WorkoutDomainMock.getWorkoutCreateParams({
      userId,
    });

    await expect(
      createWorkoutUseCase.execute({
        ...createWorkoutParams,
        userId,
      }),
    ).rejects.toThrowError(
      new BadRequestException({
        message: WorkoutDomainError.messages.userNotFound(
          createWorkoutParams.userId,
        ),
      }),
    );
  });
});
