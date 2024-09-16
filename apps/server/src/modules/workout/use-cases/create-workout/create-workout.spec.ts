import { HttpException, HttpStatus, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { WorkoutDtoError } from '~/modules/workout/dto/errors/workout-dto-errors';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { left, right } from '~/shared/either';

type GetModuleTestParams = {
  workoutRepositoryProvider?: Provider;
};

describe('CreateWorkout use case', () => {
  let userDomain: UserDomain;
  let workoutDomain: WorkoutDomain;
  let module: TestingModule;

  beforeEach(async () => {
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

  const getModuleTest = async ({
    workoutRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!workoutRepositoryProvider) {
      workoutRepositoryProvider = getWorkoutRepositoryProvider({
        workoutDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        workoutRepositoryProvider,
        WorkoutMapper,
        UserMapper,
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

  it('Should not create a workout if workout domain is invalid', async () => {
    const createWorkoutUseCase = module.get<CreateWorkout>(CreateWorkout);
    const createWorkoutParams = WorkoutDomainMock.getWorkoutCreateParams({
      name: '',
    });

    await expect(
      createWorkoutUseCase.execute({
        ...createWorkoutParams,
        userId: userDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(HttpException);
  });

  it('Should not create a workout if workout repository fails', async () => {
    const mockErrorMessage = 'Mock error';
    const mockErrorCode = 500;

    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(new UserMapper()),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    workoutRepositoryMock.create = jest.fn().mockResolvedValue(
      left({
        message: mockErrorMessage,
        code: mockErrorCode,
      }),
    );

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });

    const createWorkoutUseCase = module.get<CreateWorkout>(CreateWorkout);
    const createWorkoutParams = WorkoutDomainMock.getWorkoutCreateParams();

    await expect(
      createWorkoutUseCase.execute({
        ...createWorkoutParams,
        userId: userDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(
      new HttpException(
        {
          message: mockErrorMessage,
        },
        mockErrorCode,
      ),
    );
  });

  it('Should not create a workout if workout dto fails', async () => {
    const workoutDomainWithoutId = WorkoutDomainMock.mountWorkoutDomain({
      withoutId: true,
    });

    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(new UserMapper()),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    workoutRepositoryMock.create = jest
      .fn()
      .mockResolvedValue(right(workoutDomainWithoutId));

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });

    const createWorkoutUseCase = module.get<CreateWorkout>(CreateWorkout);
    const createWorkoutParams = WorkoutDomainMock.getWorkoutCreateParams();

    await expect(
      createWorkoutUseCase.execute({
        ...createWorkoutParams,
        userId: userDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(
      new HttpException(
        WorkoutDtoError.messages.missingId,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
