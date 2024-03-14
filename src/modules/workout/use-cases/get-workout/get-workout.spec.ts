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
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { WorkoutDtoError } from '~/modules/workout/dto/errors/workout-dto-errors';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import { GetWorkout } from '~/modules/workout/use-cases/get-workout';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';

type GetModuleTestParams = {
  workoutRepositoryProvider?: Provider;
};

describe('GetWorkout use case', () => {
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
      providers: [workoutRepositoryProvider, WorkoutMapper, GetWorkout],
    }).compile();
  };

  it('Should get workout', async () => {
    const getWorkoutUseCase = module.get<GetWorkout>(GetWorkout);
    const workoutParams = {
      id: workoutDomain.id?.toString() as string,
      userId: userDomain.id?.toString() as string,
    };

    const workout = await getWorkoutUseCase.execute(workoutParams);
    expect(workout.id).toBe(workoutDomain.id?.toString());
    expect(workout).toBeInstanceOf(WorkoutDto);
  });

  it('Should not get workout if it does not exist', async () => {
    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    const findOneByIdWorkoutsMock = jest.fn().mockResolvedValue(null);
    workoutRepositoryMock.findOneById = findOneByIdWorkoutsMock;

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain,
      }),
    });
    const getWorkoutUseCase = module.get<GetWorkout>(GetWorkout);

    const workoutParams = {
      id: 'invalid-id',
      userId: userDomain.id?.toString() as string,
    };
    await expect(getWorkoutUseCase.execute(workoutParams)).rejects.toThrow(
      new BadRequestException({
        message: WorkoutUseCaseError.messages.workoutNotFound(workoutParams.id),
      }),
    );
  });

  it('Should not get workout if it is private and user is not the owner', async () => {
    const privateWorkoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      isPrivate: true,
    });
    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    const findOneByIdWorkoutsMock = jest
      .fn()
      .mockResolvedValue(privateWorkoutDomain);
    workoutRepositoryMock.findOneById = findOneByIdWorkoutsMock;

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain: privateWorkoutDomain,
      }),
    });
    const getWorkoutUseCase = module.get<GetWorkout>(GetWorkout);
    const workoutParams = {
      id: privateWorkoutDomain.id?.toString() as string,
      userId: 'not-owner-user-id',
    };

    await expect(getWorkoutUseCase.execute(workoutParams)).rejects.toThrow(
      new ForbiddenException(WorkoutUseCaseError.messages.workoutIsPrivate),
    );
  });

  it('Should not get workout if it is workout dto fails', async () => {
    const workoutDomainWithoutId = WorkoutDomainMock.mountWorkoutDomain({
      withoutId: true,
    });

    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    const findOneByIdWorkoutsMock = jest
      .fn()
      .mockResolvedValue(workoutDomainWithoutId);
    workoutRepositoryMock.findOneById = findOneByIdWorkoutsMock;

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain: workoutDomainWithoutId,
      }),
    });

    const getWorkoutUseCase = module.get<GetWorkout>(GetWorkout);
    const workoutParams = {
      id: workoutDomainWithoutId.id?.toString() as string,
      userId: userDomain.id?.toString() as string,
    };

    await expect(getWorkoutUseCase.execute(workoutParams)).rejects.toThrow(
      new HttpException(
        WorkoutDtoError.messages.missingId,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
