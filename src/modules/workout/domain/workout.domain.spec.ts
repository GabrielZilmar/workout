import { HttpStatus } from '@nestjs/common';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutName from '~/modules/workout/domain/value-objects/name';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { left } from '~/shared/either';

describe('WorkoutDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a Workout domain', () => {
    const workoutParams = WorkoutDomainMock.getWorkoutCreateParams();
    const workout = WorkoutDomain.create(workoutParams);

    expect(workout.isRight).toBeTruthy();
    expect(workout.value).toBeInstanceOf(WorkoutDomain);

    const workoutProps = WorkoutDomainMock.getWorkoutDomainProps();
    expect({ ...(workout.value as WorkoutDomain).props }).toEqual(workoutProps);
    expect((workout.value as WorkoutDomain).name.value).toBe(
      workoutParams.name,
    );
    expect((workout.value as WorkoutDomain).userId).toBe(workoutParams.userId);
    expect((workout.value as WorkoutDomain).privateStatus.isPrivate()).toBe(
      workoutParams.isPrivate,
    );
    expect((workout.value as WorkoutDomain).routineStatus.isRoutine()).toBe(
      workoutParams.isRoutine,
    );
  });

  it('Should create a Workout domain without optional params', () => {
    const workoutParams = WorkoutDomainMock.getWorkoutCreateParams();
    const workout = WorkoutDomain.create({
      name: workoutParams.name,
      userId: workoutParams.userId,
    });

    expect(workout.isRight).toBeTruthy();
    expect(workout.value).toBeInstanceOf(WorkoutDomain);

    const workoutProps = WorkoutDomainMock.getWorkoutDomainProps();
    expect({ ...(workout.value as WorkoutDomain).props }).toEqual(workoutProps);
    expect((workout.value as WorkoutDomain).name.value).toBe(
      workoutParams.name,
    );
    expect((workout.value as WorkoutDomain).userId).toBe(workoutParams.userId);
    expect(
      (workout.value as WorkoutDomain).privateStatus.isPrivate(),
    ).toBeFalsy();
    expect(
      (workout.value as WorkoutDomain).routineStatus.isRoutine(),
    ).toBeFalsy();
  });

  it('Should not create a Workout with invalid props', () => {
    const workoutParams = WorkoutDomainMock.getWorkoutCreateParams({
      name: '',
      userId: '',
    });
    const workout = WorkoutDomain.create(workoutParams);

    expect(workout.isLeft).toBeTruthy();
    expect(workout.value).toBeInstanceOf(WorkoutDomainError);
    expect((workout.value as WorkoutDomainError).message).toBe(
      WorkoutDomainError.messages.missingProps,
    );
    expect((workout.value as WorkoutDomainError).code).toBe(
      HttpStatus.BAD_REQUEST,
    );
  });

  it('Should not create a Workout with invalid value object', () => {
    WorkoutName.create = jest
      .fn()
      .mockImplementation(() =>
        left(
          WorkoutDomainError.create(
            WorkoutDomainError.messages.emptyWorkoutName,
            HttpStatus.BAD_REQUEST,
          ),
        ),
      );

    const workoutParams = WorkoutDomainMock.getWorkoutCreateParams();
    const workout = WorkoutDomain.create(workoutParams);

    expect(workout.isLeft).toBeTruthy();
    expect(workout.value).toBeInstanceOf(WorkoutDomainError);
    expect((workout.value as WorkoutDomainError).message).toBe(
      WorkoutDomainError.messages.emptyWorkoutName,
    );
    expect((workout.value as WorkoutDomainError).code).toBe(
      HttpStatus.BAD_REQUEST,
    );
  });
});
