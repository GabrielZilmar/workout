import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseTutorialUrl from '~/modules/exercise/domain/value-objects/tutorial-url';

type ExerciseTutorialUrlPublicClass = ExerciseTutorialUrl & {
  isValid(): boolean;
};

describe('ExerciseTutorialUrl value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a exercise tutorial URL value object', () => {
    const isValidSpy = jest.spyOn(
      ExerciseTutorialUrl as unknown as ExerciseTutorialUrlPublicClass,
      'isValid',
    );

    // HTTPS Test
    const exerciseTutorialUrlValue = 'https://www.youtube.com/watch?v=123';
    const exerciseTutorialUrl = ExerciseTutorialUrl.create({
      value: exerciseTutorialUrlValue,
    });

    expect(exerciseTutorialUrl.value).toBeInstanceOf(ExerciseTutorialUrl);
    expect((exerciseTutorialUrl.value as ExerciseTutorialUrl).value).toBe(
      exerciseTutorialUrlValue,
    );
    expect(exerciseTutorialUrl.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    // HTTP Test
    const exerciseTutorialUrlHttpValue = 'http://www.youtube.com/watch?v=123';
    const exerciseTutorialHttpUrl = ExerciseTutorialUrl.create({
      value: exerciseTutorialUrlHttpValue,
    });

    expect(exerciseTutorialHttpUrl.value).toBeInstanceOf(ExerciseTutorialUrl);
    expect((exerciseTutorialHttpUrl.value as ExerciseTutorialUrl).value).toBe(
      exerciseTutorialUrlHttpValue,
    );
    expect(exerciseTutorialHttpUrl.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    // Without protocol test
    const exerciseTutorialUrlNoProtocolValue =
      'http://www.youtube.com/watch?v=123';
    const exerciseTutorialUrlNoProtocol = ExerciseTutorialUrl.create({
      value: exerciseTutorialUrlNoProtocolValue,
    });

    expect(exerciseTutorialUrlNoProtocol.value).toBeInstanceOf(
      ExerciseTutorialUrl,
    );
    expect(
      (exerciseTutorialUrlNoProtocol.value as ExerciseTutorialUrl).value,
    ).toBe(exerciseTutorialUrlNoProtocolValue);
    expect(exerciseTutorialUrlNoProtocol.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a exercise tutorial URL value object with an invalid URL', () => {
    const exerciseTutorialUrlValue = 'w.invalid-url.c';
    const exerciseTutorialUrl = ExerciseTutorialUrl.create({
      value: exerciseTutorialUrlValue,
    });

    expect(exerciseTutorialUrl.value).toEqual(
      ExerciseDomainError.create(
        ExerciseDomainError.messages.invalidTutorialUrl,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(exerciseTutorialUrl.isLeft()).toBeTruthy();
  });
});
