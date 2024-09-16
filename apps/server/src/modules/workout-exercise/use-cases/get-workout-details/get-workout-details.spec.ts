import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import SetDomain from '~/modules/set/domain/set.domain';
import { SetDto } from '~/modules/set/dto/set.dto';
import { UserDomain } from '~/modules/users/domain/users.domain';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import { GetWorkoutExerciseDetails } from '~/modules/workout-exercise/use-cases/get-workout-details';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';

describe('GetWorkoutExercise Use case', () => {
  let userDomain: UserDomain;
  let workoutDomain: WorkoutDomain;
  let setDomain: SetDomain;
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let module: TestingModule;

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    setDomain = SetDomainMock.mountSetDomain();
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      userId: userDomain.id?.toString(),
      isPrivate: true,
    });
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutId: workoutDomain.id?.toString(),
        workoutDomain,
        setDtos: [setDomain.toDto().value as SetDto],
      });
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async () => {
    const workoutExerciseRepositoryProvider =
      getWorkoutExerciseRepositoryProvider({
        workoutExerciseDomain,
      });

    return Test.createTestingModule({
      imports: [],
      providers: [workoutExerciseRepositoryProvider, GetWorkoutExerciseDetails],
    }).compile();
  };

  it('Should get workout exercise details', async () => {
    const getWorkoutExerciseDetailsUseCase =
      module.get<GetWorkoutExerciseDetails>(GetWorkoutExerciseDetails);

    const workoutExercise = await getWorkoutExerciseDetailsUseCase.execute({
      userId: userDomain.id?.toString() as string,
      id: workoutExerciseDomain.id?.toString() as string,
    });

    expect(workoutExercise).toEqual(workoutExerciseDomain.toDetailsDto().value);
  });

  it('Should get workout exercise details if user is not the owner but workout is public', async () => {
    const getWorkoutExerciseDetailsUseCase =
      module.get<GetWorkoutExerciseDetails>(GetWorkoutExerciseDetails);

    const publicWorkoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      isPrivate: false,
    });
    const workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain: publicWorkoutDomain,
        workoutId: publicWorkoutDomain.id?.toString(),
      });
    jest
      .spyOn(
        getWorkoutExerciseDetailsUseCase['workoutExerciseRepository'],
        'findOneByIdWithRelations',
      )
      .mockResolvedValue(workoutExerciseDomain);

    const workoutExercise = await getWorkoutExerciseDetailsUseCase.execute({
      userId: 'other-user-id',
      id: workoutExerciseDomain.id?.toString() as string,
    });

    expect(workoutExercise).toEqual(workoutExerciseDomain.toDetailsDto().value);
  });

  it('Should not get workout exercise details if workout exercise not found', async () => {
    const getWorkoutExerciseDetailsUseCase =
      module.get<GetWorkoutExerciseDetails>(GetWorkoutExerciseDetails);

    jest
      .spyOn(
        getWorkoutExerciseDetailsUseCase['workoutExerciseRepository'],
        'findOneByIdWithRelations',
      )
      .mockResolvedValue(null);

    await expect(
      getWorkoutExerciseDetailsUseCase.execute({
        userId: userDomain.id?.toString() as string,
        id: 'invalid-id',
      }),
    ).rejects.toThrowError(
      new HttpException(
        WorkoutExerciseUseCaseError.messages.workoutExerciseNotFound(
          'invalid-id',
        ),
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('Should not get workout exercise details if workout domain not found', async () => {
    const mountWorkoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain();

    const getWorkoutExerciseDetailsUseCase =
      module.get<GetWorkoutExerciseDetails>(GetWorkoutExerciseDetails);

    jest
      .spyOn(
        getWorkoutExerciseDetailsUseCase['workoutExerciseRepository'],
        'findOneByIdWithRelations',
      )
      .mockResolvedValue(mountWorkoutExerciseDomain);

    await expect(
      getWorkoutExerciseDetailsUseCase.execute({
        userId: userDomain.id?.toString() as string,
        id: 'invalid-id',
      }),
    ).rejects.toThrowError(
      new HttpException(
        WorkoutExerciseUseCaseError.messages.workoutNotFound(
          mountWorkoutExerciseDomain.workoutId,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });

  it('Should not get workout exercise details if workout exercise not belongs to that user', async () => {
    const getWorkoutExerciseDetailsUseCase =
      module.get<GetWorkoutExerciseDetails>(GetWorkoutExerciseDetails);

    const userId = 'other-user-id';
    await expect(
      getWorkoutExerciseDetailsUseCase.execute({
        userId: userId,
        id: workoutExerciseDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(
      new ForbiddenException(
        WorkoutExerciseUseCaseError.messages.cannotAccessOthersWorkoutExercise,
      ),
    );
  });

  it('Should not get workout exercise details if toDetailsDto return left', async () => {
    const getWorkoutExerciseDetailsUseCase =
      module.get<GetWorkoutExerciseDetails>(GetWorkoutExerciseDetails);

    const workoutExerciseDomainWithoutId =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        withoutId: true,
      });
    jest
      .spyOn(
        getWorkoutExerciseDetailsUseCase['workoutExerciseRepository'],
        'findOneByIdWithRelations',
      )
      .mockResolvedValue(workoutExerciseDomainWithoutId);

    await expect(
      getWorkoutExerciseDetailsUseCase.execute({
        userId: userDomain.id?.toString() as string,
        id: workoutExerciseDomainWithoutId.id?.toString() as string,
      }),
    ).rejects.toThrow();
  });
});
