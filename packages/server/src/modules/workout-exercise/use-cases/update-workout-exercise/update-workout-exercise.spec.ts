import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import SetMapper from '~/modules/set/mappers/set.mapper';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import { UpdateWorkoutExercise } from '~/modules/workout-exercise/use-cases/update-workout-exercise';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left } from '~/shared/either';

describe('UpdateWorkoutExercise use case', () => {
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let workoutDomain: WorkoutDomain;
  let exerciseDomain: ExerciseDomain;
  let module: TestingModule;

  beforeEach(async () => {
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain();
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
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
    const workoutRepositoryProvider = getWorkoutRepositoryProvider({
      workoutDomain,
    });
    const exerciseRepositoryProvider = getExerciseRepositoryProvider({
      exerciseDomain,
    });

    return Test.createTestingModule({
      imports: [],
      providers: [
        workoutExerciseRepositoryProvider,
        workoutRepositoryProvider,
        exerciseRepositoryProvider,
        WorkoutMapper,
        UserMapper,
        ExerciseMapper,
        MuscleMapper,
        SetMapper,
        WorkoutExerciseMapper,
        UpdateWorkoutExercise,
      ],
    }).compile();
  };

  it('Should update a workout exercise', async () => {
    const updateWorkoutExercise = module.get<UpdateWorkoutExercise>(
      UpdateWorkoutExercise,
    );

    const workoutParams = {
      id: workoutExerciseDomain.id?.toString() as string,
      userId: workoutDomain.userId as string,
      workoutId: workoutDomain.id?.toString() as string,
      exerciseId: exerciseDomain.id?.toString() as string,
      order: 99,
    };

    const result = await updateWorkoutExercise.execute(workoutParams);
    expect(result).toBe(true);
  });

  it('Should not update if workout exercise not found', async () => {
    const updateWorkoutExercise = module.get<UpdateWorkoutExercise>(
      UpdateWorkoutExercise,
    );
    jest
      .spyOn(updateWorkoutExercise['workoutExerciseRepository'], 'findOneById')
      .mockResolvedValue(null);

    const workoutParams = {
      id: workoutExerciseDomain.id?.toString() as string,
      userId: workoutDomain.userId as string,
      workoutId: workoutDomain.id?.toString() as string,
      exerciseId: exerciseDomain.id?.toString() as string,
      order: 99,
    };

    await expect(updateWorkoutExercise.execute(workoutParams)).rejects.toThrow(
      new NotFoundException(
        WorkoutExerciseUseCaseError.messages.workoutExerciseNotFound(
          workoutParams.id,
        ),
      ),
    );
  });

  it('Should not update if workout exercise if workout not found', async () => {
    const updateWorkoutExercise = module.get<UpdateWorkoutExercise>(
      UpdateWorkoutExercise,
    );
    jest
      .spyOn(updateWorkoutExercise['workoutRepository'], 'findOneById')
      .mockResolvedValue(null);

    const workoutParams = {
      id: workoutExerciseDomain.id?.toString() as string,
      userId: workoutDomain.userId as string,
      workoutId: 'INVLAID-WORKOUT-ID',
      exerciseId: exerciseDomain.id?.toString() as string,
      order: 99,
    };

    await expect(updateWorkoutExercise.execute(workoutParams)).rejects.toThrow(
      new NotFoundException(
        WorkoutExerciseUseCaseError.messages.workoutNotFound(
          workoutParams.workoutId,
        ),
      ),
    );
  });

  it("Should not update if workout exercise if workoutId from params don't belongs to user", async () => {
    const updateWorkoutExercise = module.get<UpdateWorkoutExercise>(
      UpdateWorkoutExercise,
    );

    const forbiddenWorkoutId = WorkoutDomainMock.mountWorkoutDomain({
      userId: 'other-user-id',
    });
    jest
      .spyOn(updateWorkoutExercise['workoutRepository'], 'findOneById')
      .mockResolvedValue(forbiddenWorkoutId);

    const workoutParams = {
      id: workoutExerciseDomain.id?.toString() as string,
      userId: workoutDomain.userId as string,
      workoutId: forbiddenWorkoutId.id?.toString() as string,
      exerciseId: 'new-exercise-id',
      order: 99,
    };

    await expect(updateWorkoutExercise.execute(workoutParams)).rejects.toThrow(
      new NotFoundException(
        WorkoutExerciseUseCaseError.messages.workoutNotBelongToUser(
          workoutParams.workoutId,
        ),
      ),
    );
  });

  it('Should not update if exercise not found', async () => {
    const updateWorkoutExercise = module.get<UpdateWorkoutExercise>(
      UpdateWorkoutExercise,
    );
    jest
      .spyOn(updateWorkoutExercise['exerciseRepository'], 'findOneById')
      .mockResolvedValue(null);

    const workoutParams = {
      id: workoutExerciseDomain.id?.toString() as string,
      userId: workoutDomain.userId as string,
      workoutId: workoutDomain.id?.toString() as string,
      exerciseId: 'INVALID-EXERCISE-ID',
      order: 99,
    };

    await expect(updateWorkoutExercise.execute(workoutParams)).rejects.toThrow(
      new NotFoundException(
        WorkoutExerciseUseCaseError.messages.exerciseNotFound(
          workoutParams.exerciseId,
        ),
      ),
    );
  });

  it('Should not update if workout exercise domain update fails', async () => {
    const updateWorkoutExercise = module.get<UpdateWorkoutExercise>(
      UpdateWorkoutExercise,
    );

    const workoutParams = {
      id: workoutExerciseDomain.id?.toString() as string,
      userId: workoutDomain.userId as string,
      workoutId: workoutDomain.id?.toString() as string,
      exerciseId: exerciseDomain.id?.toString() as string,
      order: -1,
    };

    await expect(updateWorkoutExercise.execute(workoutParams)).rejects.toThrow(
      new HttpException(
        WorkoutExerciseDomainError.messages.invalidOrder,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not update if workout exercise domain update fails', async () => {
    const updateWorkoutExercise = module.get<UpdateWorkoutExercise>(
      UpdateWorkoutExercise,
    );

    const errorMock = RepositoryError.create('Error message', 500);
    jest
      .spyOn(updateWorkoutExercise['workoutExerciseRepository'], 'update')
      .mockResolvedValue(left(errorMock));

    const workoutParams = {
      id: workoutExerciseDomain.id?.toString() as string,
      userId: workoutDomain.userId as string,
      workoutId: workoutDomain.id?.toString() as string,
      exerciseId: exerciseDomain.id?.toString() as string,
      order: 99,
    };

    await expect(updateWorkoutExercise.execute(workoutParams)).rejects.toThrow(
      errorMock,
    );
  });
});
