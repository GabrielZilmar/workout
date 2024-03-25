import { HttpStatus } from '@nestjs/common';
import { WorkoutExerciseDomainMock } from 'test/utils/domains/workout-exercise-domain.mock';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseDomain, {
  WorkoutExerciseDomainCreateParams,
  WorkoutExerciseDomainProps,
} from '~/modules/workout-exercise/domain/workout-exercise.domain';

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
        WorkoutExerciseDomainError.messages.invalidOrder,
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
        WorkoutExerciseDomainError.messages.invalidOrder,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
