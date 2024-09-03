import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseName from '~/modules/exercise/domain/value-objects/name';

type ExerciseNamePublicClass = ExerciseName & {
  isValid(): boolean;
};
describe('ExerciseName value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('It should create a exercise name value object', () => {
    const isValidSpy = jest.spyOn(
      ExerciseName as unknown as ExerciseNamePublicClass,
      'isValid',
    );

    const exerciseNameValue = 'Exercise teSt one ';
    const exerciseName = ExerciseName.create({ value: exerciseNameValue });

    expect(exerciseName.value).toBeInstanceOf(ExerciseName);
    expect(exerciseName.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const exerciseNameValueObject = exerciseName.value as ExerciseName;
    const capitalizedExerciseNameValue = 'Exercise Test One';
    expect(exerciseNameValueObject.value).toBe(capitalizedExerciseNameValue);
  });

  it('Should not create a exercise name value object with less than 3 characters', () => {
    const exerciseNameValue = 'Ex';
    const exerciseName = ExerciseName.create({ value: exerciseNameValue });

    expect(exerciseName.value).toEqual(
      ExerciseDomainError.create(
        ExerciseDomainError.messages.invalidExerciseName,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(exerciseName.isLeft()).toBeTruthy();
  });
});
