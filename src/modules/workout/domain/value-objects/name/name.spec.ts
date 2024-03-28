import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutName from '~/modules/workout/domain/value-objects/name';

type WorkoutNamePublicClass = WorkoutName & {
  isValid(): boolean;
};

describe('Workout name value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a workout name value object', () => {
    const isValidSpy = jest.spyOn(
      WorkoutName as unknown as WorkoutNamePublicClass,
      'isValid',
    );

    const workoutNameValue = 'Workout name';
    const workoutName = WorkoutName.create({ value: workoutNameValue });

    expect(workoutName.value).toBeInstanceOf(WorkoutName);
    expect(workoutName.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const workoutNameValueObject = workoutName.value as WorkoutName;
    expect(workoutNameValueObject.value).toBe(workoutNameValue);
  });

  it('Should not create a workout name value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      WorkoutName as unknown as WorkoutNamePublicClass,
      'isValid',
    );

    const workoutNameValue = '';
    const workoutName = WorkoutName.create({ value: workoutNameValue });

    expect(workoutName.value).toBeInstanceOf(Error);
    expect(workoutName.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const workoutNameValueObject = workoutName.value as WorkoutDomainError;
    expect(workoutNameValueObject.message).toBe(
      WorkoutDomainError.messages.emptyWorkoutName,
    );
  });
});
