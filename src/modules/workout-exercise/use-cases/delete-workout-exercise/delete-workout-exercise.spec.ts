import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import SetMapper from '~/modules/set/mappers/set.mapper';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import DeleteWorkoutExercise from '~/modules/workout-exercise/use-cases/delete-workout-exercise';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left } from '~/shared/either';

describe('DeleteWorkoutExerciseUseCase', () => {
  let workoutExerciseDomain: WorkoutExerciseDomain;
  let workoutDomain: WorkoutDomain;
  let exerciseDomain: ExerciseDomain;
  let module: TestingModule;

  beforeEach(async () => {
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain,
        exerciseDomain,
        workoutId: workoutDomain.id?.toValue() as string,
        exerciseId: exerciseDomain.id?.toValue() as string,
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
        ExerciseMapper,
        SetMapper,
        WorkoutExerciseMapper,
        DeleteWorkoutExercise,
      ],
    }).compile();
  };

  it('Should delete a workout exercise id', async () => {
    const deleteWorkoutExercise = module.get<DeleteWorkoutExercise>(
      DeleteWorkoutExercise,
    );

    const result = await deleteWorkoutExercise.execute({
      id: workoutExerciseDomain.id?.toValue() as string,
      userId: workoutDomain.userId,
    });
    expect(result).toBe(true);
  });

  it('Should not delete a workout exercise if it does not exist', async () => {
    const deleteWorkoutExercise = module.get<DeleteWorkoutExercise>(
      DeleteWorkoutExercise,
    );
    jest
      .spyOn(
        deleteWorkoutExercise['workoutExerciseRepository'],
        'findOneByIdWithRelations',
      )
      .mockResolvedValue(null);

    await expect(
      deleteWorkoutExercise.execute({
        id: workoutExerciseDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
      }),
    ).rejects.toThrowError(
      new HttpException(
        WorkoutExerciseUseCaseError.messages.workoutExerciseNotFound(
          workoutExerciseDomain.id?.toValue() as string,
        ),
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('Should not delete a workout exercise if it is not the owner', async () => {
    const deleteWorkoutExercise = module.get<DeleteWorkoutExercise>(
      DeleteWorkoutExercise,
    );

    await expect(
      deleteWorkoutExercise.execute({
        id: workoutExerciseDomain.id?.toValue() as string,
        userId: 'other-user-id',
      }),
    ).rejects.toThrowError(
      new HttpException(
        WorkoutExerciseUseCaseError.messages.cannotDeleteOthersWorkoutExercise,
        HttpStatus.FORBIDDEN,
      ),
    );
  });

  it('Should not delete a workout exercise if repository fails', async () => {
    const deleteWorkoutExercise = module.get<DeleteWorkoutExercise>(
      DeleteWorkoutExercise,
    );
    const errorMock = RepositoryError.create('Error message', 500);
    jest
      .spyOn(deleteWorkoutExercise['workoutExerciseRepository'], 'delete')
      .mockResolvedValue(left(errorMock));

    await expect(
      deleteWorkoutExercise.execute({
        id: workoutExerciseDomain.id?.toValue() as string,
        userId: workoutDomain.userId,
      }),
    ).rejects.toThrowError(
      new HttpException({ message: errorMock.message }, errorMock.code),
    );
  });
});
