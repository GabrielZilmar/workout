import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseDomain, {
  WorkoutExerciseDomainCreateParams,
  WorkoutExerciseDomainProps,
} from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { SharedValueObjectError } from '~/shared/domain/value-objects/errors';
import { Either } from '~/shared/either';

type WorkoutExerciseDomainPublicClass = WorkoutExerciseDomain & {
  idValid: () => boolean;
  mountValueObjects: (
    props: WorkoutExerciseDomainCreateParams,
  ) => Either<WorkoutExerciseDomainError, WorkoutExerciseDomainProps>;
};

describe('WorkoutExerciseDomain', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create a workout exercise domain', () => {
    const workoutExerciseParams =
      WorkoutExerciseDomainMock.getWorkoutExerciseCreateParams();
    const workoutExercise = WorkoutExerciseDomain.create(workoutExerciseParams);

    expect(workoutExercise.isRight()).toBeTruthy();
    expect(workoutExercise.value).toBeInstanceOf(WorkoutExerciseDomain);

    const workoutExerciseProps =
      WorkoutExerciseDomainMock.getWorkoutExerciseDomainProps();
    expect({
      ...(workoutExercise.value as WorkoutExerciseDomain).props,
    }).toEqual(workoutExerciseProps);
    expect((workoutExercise.value as WorkoutExerciseDomain).workoutId).toBe(
      workoutExerciseParams.workoutId,
    );
    expect((workoutExercise.value as WorkoutExerciseDomain).exerciseId).toBe(
      workoutExerciseParams.exerciseId,
    );
    expect((workoutExercise.value as WorkoutExerciseDomain).order?.value).toBe(
      workoutExerciseParams.order,
    );
  });

  it('Should not create a workout exercise with invalid props', () => {
    const mountValueObjectsSpy = jest.spyOn(
      WorkoutExerciseDomain as unknown as WorkoutExerciseDomainPublicClass,
      'mountValueObjects',
    );

    const workoutExerciseParams =
      WorkoutExerciseDomainMock.getWorkoutExerciseCreateParams({
        workoutId: '',
        exerciseId: '',
      });
    const workoutExercise = WorkoutExerciseDomain.create(workoutExerciseParams);

    expect(workoutExercise.isLeft()).toBeTruthy();
    expect(workoutExercise.value).toEqual(
      WorkoutExerciseDomainError.create(
        WorkoutExerciseDomainError.messages.missingProps,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(mountValueObjectsSpy).not.toBeCalled();
  });

  it('Should not create a workout exercise with invalid order', () => {
    const mountValueObjectsSpy = jest.spyOn(
      WorkoutExerciseDomain as unknown as WorkoutExerciseDomainPublicClass,
      'mountValueObjects',
    );

    const workoutExerciseParams =
      WorkoutExerciseDomainMock.getWorkoutExerciseCreateParams({
        order: -1,
      });
    const workoutExercise = WorkoutExerciseDomain.create(workoutExerciseParams);

    expect(workoutExercise.isLeft()).toBeTruthy();
    expect(workoutExercise.value).toEqual(
      WorkoutExerciseDomainError.create(
        SharedValueObjectError.messages.invalidOrder,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(mountValueObjectsSpy).toHaveBeenCalledWith(workoutExerciseParams);
  });

  it('Should update a workout exercise domain', () => {
    const workoutExerciseParams =
      WorkoutExerciseDomainMock.getWorkoutExerciseCreateParams();
    const workoutExercise = WorkoutExerciseDomain.create(workoutExerciseParams);

    expect(workoutExercise.isRight()).toBeTruthy();
    expect(workoutExercise.value).toBeInstanceOf(WorkoutExerciseDomain);

    const newWorkoutId = 'new-workout-id';
    const newExerciseId = 'new-exercise-id';
    const newOrder = 1;

    const updatedWorkoutExercise = (
      workoutExercise.value as WorkoutExerciseDomain
    ).update({
      workoutId: newWorkoutId,
      exerciseId: newExerciseId,
      order: newOrder,
    });

    expect(updatedWorkoutExercise.isRight()).toBeTruthy();
    expect(updatedWorkoutExercise.value).toBeInstanceOf(WorkoutExerciseDomain);

    const updatedWorkoutExerciseProps =
      WorkoutExerciseDomainMock.getWorkoutExerciseDomainProps({
        workoutId: newWorkoutId,
        exerciseId: newExerciseId,
        order: newOrder,
      });
    expect({
      ...(updatedWorkoutExercise.value as WorkoutExerciseDomain).props,
    }).toEqual(updatedWorkoutExerciseProps);
    expect(
      (updatedWorkoutExercise.value as WorkoutExerciseDomain).workoutId,
    ).toBe(newWorkoutId);
    expect(
      (updatedWorkoutExercise.value as WorkoutExerciseDomain).exerciseId,
    ).toBe(newExerciseId);
    expect(
      (updatedWorkoutExercise.value as WorkoutExerciseDomain).order.value,
    ).toBe(newOrder);
  });

  it('Should not update a workout exercise domain if a vo is invalid', () => {
    const workoutExerciseParams =
      WorkoutExerciseDomainMock.getWorkoutExerciseCreateParams();
    const workoutExercise = WorkoutExerciseDomain.create(workoutExerciseParams);

    expect(workoutExercise.isRight()).toBeTruthy();
    expect(workoutExercise.value).toBeInstanceOf(WorkoutExerciseDomain);

    const updatedWorkoutExercise = (
      workoutExercise.value as WorkoutExerciseDomain
    ).update({
      order: -1,
    });

    expect(updatedWorkoutExercise.isLeft()).toBeTruthy();
    expect(updatedWorkoutExercise.value).toEqual(
      WorkoutExerciseDomainError.create(
        SharedValueObjectError.messages.invalidOrder,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not update a workout exercise domain if workoutId and workoutDomain do not match', () => {
    const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    const exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    const workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain,
        exerciseDomain,
        workoutId: workoutDomain.id?.toValue() as string,
        exerciseId: exerciseDomain.id?.toValue() as string,
      });

    const updatedWorkoutExercise = workoutExerciseDomain.update({
      workoutId: 'new-workout-id',
      workoutDomain: workoutExerciseDomain.workoutDomain,
    });

    expect(updatedWorkoutExercise.isLeft()).toBeTruthy();
    expect(updatedWorkoutExercise.value).toEqual(
      WorkoutExerciseDomainError.create(
        WorkoutExerciseDomainError.messages.workoutDomainAndWorkoutIdDoNotMatch,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not update a workout exercise domain if exerciseId and exerciseDomain do not match', () => {
    const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    const exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    const workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain,
        exerciseDomain,
        workoutId: workoutDomain.id?.toValue() as string,
        exerciseId: exerciseDomain.id?.toValue() as string,
      });

    const updatedWorkoutExercise = workoutExerciseDomain.update({
      exerciseId: 'new-exercise-id',
      exerciseDomain: workoutExerciseDomain.exerciseDomain,
    });

    expect(updatedWorkoutExercise.isLeft()).toBeTruthy();
    expect(updatedWorkoutExercise.value).toEqual(
      WorkoutExerciseDomainError.create(
        WorkoutExerciseDomainError.messages
          .exerciseDomainAndExerciseIdDoNotMatch,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should update a workout exercise domain domains', () => {
    const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    const exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    const workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain,
        exerciseDomain,
        workoutId: workoutDomain.id?.toValue() as string,
        exerciseId: exerciseDomain.id?.toValue() as string,
      });

    expect(workoutExerciseDomain.workoutId).toBe(workoutDomain.id?.toValue());
    expect(workoutExerciseDomain.exerciseId).toBe(exerciseDomain.id?.toValue());

    const newWorkoutDomain = WorkoutDomainMock.mountWorkoutDomain({
      id: 'new-workout-id',
    });
    const newExerciseDomain = ExerciseDomainMock.mountExerciseDomain({
      id: 'new-exercise-id',
    });
    workoutExerciseDomain.update({
      workoutDomain: newWorkoutDomain,
      exerciseDomain: newExerciseDomain,
    });

    expect(workoutExerciseDomain.workoutDomain).toEqual(newWorkoutDomain);
    expect(workoutExerciseDomain.workoutId).toBe(
      newWorkoutDomain.id?.toValue(),
    );
    expect(workoutExerciseDomain.exerciseDomain).toEqual(newExerciseDomain);
    expect(workoutExerciseDomain.exerciseId).toBe(
      newExerciseDomain.id?.toValue(),
    );
  });

  it('Should update a workout exercise domain ids', () => {
    const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    const exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    const workoutExerciseDomain =
      WorkoutExerciseDomainMock.mountWorkoutExerciseDomain({
        workoutDomain,
        exerciseDomain,
        workoutId: workoutDomain.id?.toValue() as string,
        exerciseId: exerciseDomain.id?.toValue() as string,
      });

    expect(workoutExerciseDomain.workoutId).toBe(workoutDomain.id?.toValue());
    expect(workoutExerciseDomain.workoutDomain).toEqual(workoutDomain);
    expect(workoutExerciseDomain.exerciseId).toBe(exerciseDomain.id?.toValue());
    expect(workoutExerciseDomain.exerciseDomain).toEqual(exerciseDomain);

    const updateParams = {
      workoutId: 'new-workout-id',
      exerciseId: 'new-exercise-id',
    };
    workoutExerciseDomain.update(updateParams);
    expect(workoutExerciseDomain.workoutId).toBe(updateParams.workoutId);
    expect(workoutExerciseDomain.workoutDomain).toBeUndefined();
    expect(workoutExerciseDomain.exerciseId).toBe(updateParams.exerciseId);
    expect(workoutExerciseDomain.exerciseDomain).toBeUndefined();
  });

  it('Should not create a workout exercise domain if ids do not match with domains', () => {
    const workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
    const exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    const workoutExerciseParams = {
      workoutDomain,
      exerciseDomain,
      workoutId: 'not-match-workout-id',
      exerciseId: 'not-match-exercise-id',
      order: 0,
    };

    let workoutExercise = WorkoutExerciseDomain.create(workoutExerciseParams);
    expect(workoutExercise.isLeft()).toBeTruthy();
    expect(workoutExercise.value).toEqual(
      WorkoutExerciseDomainError.create(
        WorkoutExerciseDomainError.messages.workoutDomainAndWorkoutIdDoNotMatch,
        HttpStatus.BAD_REQUEST,
      ),
    );

    workoutExercise = WorkoutExerciseDomain.create({
      ...workoutExerciseParams,
      workoutDomain: undefined,
      exerciseId: 'not-match-exercise-id',
    });
    expect(workoutExercise.isLeft()).toBeTruthy();
    expect(workoutExercise.value).toEqual(
      WorkoutExerciseDomainError.create(
        WorkoutExerciseDomainError.messages
          .exerciseDomainAndExerciseIdDoNotMatch,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
