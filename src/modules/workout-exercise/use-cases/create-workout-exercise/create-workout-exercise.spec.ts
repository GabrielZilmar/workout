import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import getWorkoutExerciseRepositoryProvider from 'test/utils/providers/workout-exercise-repository-mock';
import getWorkoutRepositoryProvider from 'test/utils/providers/workout-repository';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExerciseDtoError } from '~/modules/workout-exercise/dto/errors';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import { WorkoutExerciseUseCaseError } from '~/modules/workout-exercise/use-cases/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left, right } from '~/shared/either';

type GetModuleTestParams = {
  workoutExerciseRepositoryProvider?: Provider;
  workoutRepositoryProvider?: Provider;
  exerciseRepositoryProvider?: Provider;
};

describe('CreateWorkout use case', () => {
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

  const getModuleTest = async ({
    workoutExerciseRepositoryProvider,
    workoutRepositoryProvider,
    exerciseRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!workoutExerciseRepositoryProvider) {
      workoutExerciseRepositoryProvider = getWorkoutExerciseRepositoryProvider({
        workoutExerciseDomain,
      });
    }

    if (!workoutRepositoryProvider) {
      workoutRepositoryProvider = getWorkoutRepositoryProvider({
        workoutDomain,
      });
    }

    if (!exerciseRepositoryProvider) {
      exerciseRepositoryProvider = getExerciseRepositoryProvider({
        exerciseDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        workoutExerciseRepositoryProvider,
        workoutRepositoryProvider,
        exerciseRepositoryProvider,
        WorkoutMapper,
        ExerciseMapper,
        WorkoutExerciseMapper,
        CreateWorkoutExercise,
      ],
    }).compile();
  };

  it('Should create a workout exercise', async () => {
    const createWorkoutExerciseUseCase = module.get<CreateWorkoutExercise>(
      CreateWorkoutExercise,
    );

    const workoutExerciseCreated = await createWorkoutExerciseUseCase.execute({
      workoutId: workoutDomain.id?.toValue() as string,
      exerciseId: exerciseDomain.id?.toValue() as string,
      order: 0,
      userId: workoutDomain.userId,
    });

    expect(workoutExerciseCreated).toEqual(workoutExerciseDomain.toDto().value);
  });

  it('Should not create a workout exercise with invalid params', async () => {
    const createWorkoutExerciseUseCase = module.get<CreateWorkoutExercise>(
      CreateWorkoutExercise,
    );

    const createWorkoutExerciseParams = {
      workoutId: workoutDomain.id?.toValue() as string,
      exerciseId: exerciseDomain.id?.toValue() as string,
      order: -1,
      userId: workoutDomain.userId,
    };

    await expect(
      createWorkoutExerciseUseCase.execute(createWorkoutExerciseParams),
    ).rejects.toThrow(
      new HttpException(
        WorkoutExerciseDomainError.messages.invalidOrder,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it("Should not create a workout exercise if workout doesn't exist", async () => {
    const createWorkoutExerciseUseCase = module.get<CreateWorkoutExercise>(
      CreateWorkoutExercise,
    );
    jest
      .spyOn(createWorkoutExerciseUseCase['workoutRepository'], 'findOneById')
      .mockResolvedValue(null);

    const createWorkoutExerciseParams = {
      workoutId: 'invalid-workout-id',
      exerciseId: exerciseDomain.id?.toValue() as string,
      order: 0,
      userId: workoutDomain.userId,
    };

    await expect(
      createWorkoutExerciseUseCase.execute(createWorkoutExerciseParams),
    ).rejects.toThrow(
      new NotFoundException(
        WorkoutExerciseUseCaseError.messages.workoutNotFound(
          createWorkoutExerciseParams.workoutId,
        ),
      ),
    );
  });

  it('Should not create a workout exercise if workout does not belong to user', async () => {
    const createWorkoutExerciseUseCase = module.get<CreateWorkoutExercise>(
      CreateWorkoutExercise,
    );

    const createWorkoutExerciseParams = {
      workoutId: workoutDomain.id?.toValue() as string,
      exerciseId: exerciseDomain.id?.toValue() as string,
      order: 0,
      userId: 'other-user-id',
    };

    await expect(
      createWorkoutExerciseUseCase.execute(createWorkoutExerciseParams),
    ).rejects.toThrow(
      new NotFoundException(
        WorkoutExerciseUseCaseError.messages.workoutNotBelongToUser(
          createWorkoutExerciseParams.workoutId,
        ),
      ),
    );
  });

  it('Should not create a workout exercise if exercise does not exist', async () => {
    const createWorkoutExerciseUseCase = module.get<CreateWorkoutExercise>(
      CreateWorkoutExercise,
    );
    jest
      .spyOn(createWorkoutExerciseUseCase['exerciseRepository'], 'findOneById')
      .mockResolvedValue(null);

    const createWorkoutExerciseParams = {
      workoutId: workoutDomain.id?.toValue() as string,
      exerciseId: 'invalid-exercise-id',
      order: 0,
      userId: workoutDomain.userId,
    };

    await expect(
      createWorkoutExerciseUseCase.execute(createWorkoutExerciseParams),
    ).rejects.toThrow(
      new NotFoundException(
        WorkoutExerciseUseCaseError.messages.exerciseNotFound(
          createWorkoutExerciseParams.exerciseId,
        ),
      ),
    );
  });

  it('Should not create a workout exercise if workout exercise repository fails', async () => {
    const createWorkoutExerciseUseCase = module.get<CreateWorkoutExercise>(
      CreateWorkoutExercise,
    );

    const errorMock = RepositoryError.create('Error', 500);
    jest
      .spyOn(
        createWorkoutExerciseUseCase['workoutExerciseRepository'],
        'create',
      )
      .mockResolvedValue(left(errorMock));

    const createWorkoutExerciseParams = {
      workoutId: workoutDomain.id?.toValue() as string,
      exerciseId: exerciseDomain.id?.toValue() as string,
      order: 0,
      userId: workoutDomain.userId,
    };

    await expect(
      createWorkoutExerciseUseCase.execute(createWorkoutExerciseParams),
    ).rejects.toThrow(errorMock);
  });

  it('Should not create a workout exercise if toDto fails', async () => {
    const createWorkoutExerciseUseCase = module.get<CreateWorkoutExercise>(
      CreateWorkoutExercise,
    );

    const workoutExerciseWithoutId =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({ withoutId: true });
    jest
      .spyOn(
        createWorkoutExerciseUseCase['workoutExerciseRepository'],
        'create',
      )
      .mockResolvedValue(right(workoutExerciseWithoutId));

    const createWorkoutExerciseParams = {
      workoutId: workoutDomain.id?.toValue() as string,
      exerciseId: exerciseDomain.id?.toValue() as string,
      order: 0,
      userId: workoutDomain.userId,
    };

    await expect(
      createWorkoutExerciseUseCase.execute(createWorkoutExerciseParams),
    ).rejects.toThrow(
      new HttpException(
        { message: WorkoutExerciseDtoError.messages.missingId },
        500,
      ),
    );
  });
});
