import { HttpException, HttpStatus, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import { UserDomain } from '~/modules/users/domain/users.domain';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { WorkoutDtoError } from '~/modules/workout/dto/errors/workout-dto-errors';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { ListPublicWorkouts } from '~/modules/workout/use-cases/list-public-workouts';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';

type GetModuleTestParams = {
  workoutRepositoryProvider?: Provider;
};

describe('ListPublicWorkouts use case', () => {
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
      providers: [workoutRepositoryProvider, WorkoutMapper, ListPublicWorkouts],
    }).compile();
  };

  it('Should list public workouts', async () => {
    let listPublicWorkoutsUseCase =
      module.get<ListPublicWorkouts>(ListPublicWorkouts);
    const listPublicWorkoutsParams = {
      userId: userDomain.id?.toString() as string,
      isRoutine: false,
      skip: 0,
      take: 10,
    };

    const workouts = await listPublicWorkoutsUseCase.execute(
      listPublicWorkoutsParams,
    );
    expect(workouts).toEqual({
      items: [workoutDomain.toDto().value],
      count: 1,
    });

    const privateWorkoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      isPrivate: true,
    });

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutDomain: privateWorkoutDomain,
      }),
    });

    listPublicWorkoutsUseCase =
      module.get<ListPublicWorkouts>(ListPublicWorkouts);
    const privateWorkouts = await listPublicWorkoutsUseCase.execute(
      listPublicWorkoutsParams,
    );
    expect(privateWorkouts).toEqual({ items: [], count: 0 });
  });

  it('Should not list public workouts dto fails', async () => {
    const workoutDomainWithoutId = WorkoutDomainMock.mountWorkoutDomain({
      withoutId: true,
    });

    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    const findPublicWorkoutsMock = jest.fn().mockResolvedValue({
      items: [workoutDomainWithoutId],
      count: 1,
    });
    workoutRepositoryMock.findPublicWorkouts = findPublicWorkoutsMock;

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain: workoutDomainWithoutId,
      }),
    });

    const listPublicWorkoutsUseCase =
      module.get<ListPublicWorkouts>(ListPublicWorkouts);

    const listPublicWorkoutsParams = {
      userId: '',
      isRoutine: false,
      skip: 0,
      take: 10,
    };

    await expect(
      listPublicWorkoutsUseCase.execute(listPublicWorkoutsParams),
    ).rejects.toThrow(
      new HttpException(
        WorkoutDtoError.messages.missingId,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
