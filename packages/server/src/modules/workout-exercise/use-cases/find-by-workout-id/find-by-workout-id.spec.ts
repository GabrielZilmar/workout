import { HttpException, HttpStatus, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import { UserDomain } from '~/modules/users/domain/users.domain';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExerciseDtoError } from '~/modules/workout-exercise/dto/errors';
import { FindByWorkoutId } from '~/modules/workout-exercise/use-cases/find-by-workout-id';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';

type GetModuleTestParams = {
  workoutExerciseRepositoryProvider?: Provider;
};

describe('FindByWorkoutId use case', () => {
  let userDomain: UserDomain;
  let workoutDomain: WorkoutDomain;
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let module: TestingModule;

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      userId: userDomain.id?.toString(),
    });
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutId: workoutDomain.id?.toString(),
      });
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async ({
    workoutExerciseRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!workoutExerciseRepositoryProvider) {
      workoutExerciseRepositoryProvider = getWorkoutExerciseRepositoryProvider({
        workoutExerciseDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [workoutExerciseRepositoryProvider, FindByWorkoutId],
    }).compile();
  };

  it('Should find workout exercise by workout id', async () => {
    const findByWorkoutIdUseCase = module.get<FindByWorkoutId>(FindByWorkoutId);

    const workoutExercises = await findByWorkoutIdUseCase.execute({
      userId: userDomain.id?.toString() as string,
      workoutId: workoutDomain.id?.toString() as string,
      skip: 0,
      take: 10,
    });
    expect(workoutExercises.items).toEqual([
      workoutExerciseDomain.toDto().value,
    ]);
    expect(workoutExercises.count).toBe(1);
  });

  it('Should not find workout exercise if user id is invalid', async () => {
    const workoutExerciseDomainWithoutId =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        withoutId: true,
      });

    const findByWorkoutIdUseCase = module.get<FindByWorkoutId>(FindByWorkoutId);
    jest
      .spyOn(
        findByWorkoutIdUseCase['workoutExerciseRepository'],
        'findUsersWorkoutExercises',
      )
      .mockResolvedValue({ items: [workoutExerciseDomainWithoutId], count: 1 });

    await expect(
      findByWorkoutIdUseCase.execute({
        userId: userDomain.id?.toString() as string,
        workoutId: workoutExerciseDomainWithoutId.id?.toString() as string,
        skip: 0,
        take: 10,
      }),
    ).rejects.toThrowError(
      new HttpException(
        { message: WorkoutExerciseDtoError.messages.missingId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
