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
import { ListWorkouts } from '~/modules/workout/use-cases/list-workouts';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';

type GetModuleTestParams = {
  workoutRepositoryProvider?: Provider;
};

describe('ListWorkouts use case', () => {
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
        ListWorkouts,
      ],
    }).compile();
  };

  it('Should list workouts', async () => {
    const listWorkoutsUseCase = module.get<ListWorkouts>(ListWorkouts);
    const listWorkoutsParams = {
      userId: userDomain.id?.toString() as string,
      isRoutine: false,
      skip: 0,
      take: 10,
    };

    const workouts = await listWorkoutsUseCase.execute(listWorkoutsParams);

    expect(workouts.items).toEqual([workoutDomain.toDto().value]);
    expect(workouts.count).toBe(1);
  });

  it('Should not list workouts if user id is invalid', async () => {
    const workoutDomainWithoutId = WorkoutDomainMock.mountWorkoutDomain({
      withoutId: true,
    });

    const workoutRepositoryMock = new WorkoutRepository(
      new WorkoutMapper(new UserMapper()),
    ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
    const findMock = jest.fn().mockResolvedValue({
      items: [workoutDomainWithoutId],
      count: 1,
    });
    workoutRepositoryMock.find = findMock;

    module = await getModuleTest({
      workoutRepositoryProvider: getWorkoutRepositoryProvider({
        workoutRepositoryMock,
        workoutDomain: workoutDomainWithoutId,
      }),
    });

    const listWorkoutsUseCase = module.get<ListWorkouts>(ListWorkouts);

    const listWorkoutsParams = {
      userId: '',
      isRoutine: false,
      skip: 0,
      take: 10,
    };

    await expect(
      listWorkoutsUseCase.execute(listWorkoutsParams),
    ).rejects.toThrow(
      new HttpException(
        WorkoutDtoError.messages.missingId,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
