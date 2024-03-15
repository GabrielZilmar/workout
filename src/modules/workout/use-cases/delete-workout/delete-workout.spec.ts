import {
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
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import DeleteWorkout from '~/modules/workout/use-cases/delete-workout';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  workoutRepositoryProvider?: Provider;
};

describe('Delete workout use case', () => {
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
      providers: [workoutRepositoryProvider, WorkoutMapper, DeleteWorkout],
    }).compile();
  };

  it('Should delete workout', async () => {
    const deleteWorkout = module.get<DeleteWorkout>(DeleteWorkout);

    const result = await deleteWorkout.execute({
      id: workoutDomain.id?.toValue() as string,
      userId: workoutDomain.userId,
    });

    expect(result).toBeTruthy();
  });

  it('Should not delete workout if it does not exist', async () => {
    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    workoutRepositoryMock.findOneById = jest.fn().mockResolvedValue(null);

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });
    const deleteWorkout = module.get<DeleteWorkout>(DeleteWorkout);

    await expect(
      deleteWorkout.execute({
        id: workoutDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
      }),
    ).rejects.toThrowError(
      new HttpException(
        WorkoutUseCaseError.messages.workoutNotFound(
          workoutDomain.id?.toValue() as string,
        ),
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('Should not delete user if it is not the owner', async () => {
    const deleteWorkout = module.get<DeleteWorkout>(DeleteWorkout);

    await expect(
      deleteWorkout.execute({
        id: workoutDomain.id?.toValue() as string,
        userId: 'other-user-id',
      }),
    ).rejects.toThrowError(
      new ForbiddenException(
        WorkoutUseCaseError.messages.cannotDeleteOthersWorkout,
      ),
    );
  });

  it('Should throw error if workout repository throws error', async () => {
    const errorMockMessage = 'Repository error';
    const errorMockStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    workoutRepositoryMock.findOneById = jest
      .fn()
      .mockResolvedValue(workoutDomain);
    workoutRepositoryMock.delete = jest
      .fn()
      .mockResolvedValue(
        left(RepositoryError.create(errorMockMessage, errorMockStatusCode)),
      );

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });
    const deleteWorkout = module.get<DeleteWorkout>(DeleteWorkout);

    await expect(
      deleteWorkout.execute({
        id: workoutDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
      }),
    ).rejects.toThrowError(
      new HttpException(
        {
          message: errorMockMessage,
        },
        errorMockStatusCode,
      ),
    );
  });
});
