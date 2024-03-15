import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import { UpdateWorkout } from '~/modules/workout/use-cases/update-workout';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  workoutRepositoryProvider?: Provider;
};

describe('UpdateWorkout use case', () => {
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
      providers: [workoutRepositoryProvider, WorkoutMapper, UpdateWorkout],
    }).compile();
  };

  it('Should update workout', async () => {
    const updateWorkoutUseCase = module.get<UpdateWorkout>(UpdateWorkout);
    const workoutParams = {
      id: workoutDomain.id?.toString() as string,
      userId: userDomain.id?.toString() as string,
      name: 'New name',
      description: 'New description',
      privateStatus: false,
    };

    const result = await updateWorkoutUseCase.execute(workoutParams);
    expect(result).toBe(true);
  });

  it('Should not update if workout not found', async () => {
    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    const findOneByIdMock = jest.fn().mockResolvedValue(null);
    workoutRepositoryMock.findOneById = findOneByIdMock;

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });
    const updateWorkoutUseCase = module.get<UpdateWorkout>(UpdateWorkout);

    const updateWorkoutParams = {
      id: workoutDomain.id?.toString() as string,
      userId: userDomain.id?.toString() as string,
      name: 'New name',
    };
    await expect(
      updateWorkoutUseCase.execute(updateWorkoutParams),
    ).rejects.toThrow(
      new BadRequestException(
        WorkoutUseCaseError.messages.workoutNotFound(updateWorkoutParams.id),
      ),
    );
  });

  it('Should not update if user is not the owner', async () => {
    const updateWorkoutUseCase = module.get<UpdateWorkout>(UpdateWorkout);

    const updateWorkoutParams = {
      id: workoutDomain.id?.toString() as string,
      userId: 'invalid-id',
      name: 'New name',
    };
    await expect(
      updateWorkoutUseCase.execute(updateWorkoutParams),
    ).rejects.toThrow(
      new ForbiddenException(
        WorkoutUseCaseError.messages.cannotUpdateOthersWorkout,
      ),
    );
  });

  it('Should not update if workout domain update fails', async () => {
    const mockErrorMessage = 'Mock error message';
    const mockErrorCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    workoutDomain.update = jest
      .fn()
      .mockImplementation(() =>
        left(new WorkoutDomainError(mockErrorMessage, mockErrorCode)),
      );
    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    workoutRepositoryMock.findOneById = jest
      .fn()
      .mockResolvedValue(workoutDomain);

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });
    const updateWorkoutUseCase = module.get<UpdateWorkout>(UpdateWorkout);

    const updateWorkoutParams = {
      id: workoutDomain.id?.toString() as string,
      userId: workoutDomain.userId,
      name: '',
    };
    await expect(
      updateWorkoutUseCase.execute(updateWorkoutParams),
    ).rejects.toThrow(
      new HttpException(
        {
          message: mockErrorMessage,
        },
        mockErrorCode,
      ),
    );
  });

  it('Should not update if workout repository update fails', async () => {
    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    workoutRepositoryMock.findOneById = jest
      .fn()
      .mockResolvedValue(workoutDomain);
    const payloadError = {
      name: workoutDomain.name.value,
    };
    workoutRepositoryMock.update = jest
      .fn()
      .mockResolvedValue(
        left(
          new RepositoryError(
            RepositoryError.messages.itemDuplicated,
            HttpStatus.BAD_REQUEST,
            payloadError,
          ),
        ),
      );

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });
    let updateWorkoutUseCase = module.get<UpdateWorkout>(UpdateWorkout);

    const updateWorkoutParams = {
      id: workoutDomain.id?.toString() as string,
      userId: workoutDomain.userId,
      name: 'update',
    };
    await expect(
      updateWorkoutUseCase.execute(updateWorkoutParams),
    ).rejects.toThrow(
      new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: RepositoryError.messages.itemDuplicated,
        payload: payloadError,
      }),
    );

    workoutRepositoryMock.update = jest
      .fn()
      .mockResolvedValue(
        left(
          new RepositoryError(
            RepositoryError.messages.updateError,
            HttpStatus.INTERNAL_SERVER_ERROR,
            payloadError,
          ),
        ),
      );

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });
    updateWorkoutUseCase = module.get<UpdateWorkout>(UpdateWorkout);

    await expect(
      updateWorkoutUseCase.execute(updateWorkoutParams),
    ).rejects.toThrow(
      new BadRequestException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: RepositoryError.messages.updateError,
        payload: undefined,
      }),
    );
  });
});
