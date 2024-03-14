import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import { UserDomain } from '~/modules/users/domain/users.domain';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { GetWorkout } from '~/modules/workout/use-cases/get-workout';

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
    const getWorkoutParams = {
      id: workoutDomain.id?.toString() as string,
      userId: userDomain.id?.toString() as string,
    };

    const workout = await getWorkoutUseCase.execute(getWorkoutParams);
    expect(workout.id).toBe(workoutDomain.id?.toString());
    expect(workout).toBeInstanceOf(WorkoutDto);
  });
});
