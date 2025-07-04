import { HttpStatus } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import ExerciseTranslationName from '~/modules/exercise-translations/domain/value-objects/name';

type ExerciseTranslationNamePublicClass = ExerciseTranslationName & {
  isValid(): boolean;
};
describe('ExerciseTranslationName value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('It should create a exercise translation name value object', () => {
    const isValidSpy = jest.spyOn(
      ExerciseTranslationName as unknown as ExerciseTranslationNamePublicClass,
      'isValid',
    );

    const exerciseTranslationNameValue = 'exercise teSt one ';
    const exerciseTranslationName = ExerciseTranslationName.create({
      value: exerciseTranslationNameValue,
    });

    expect(exerciseTranslationName.value).toBeInstanceOf(
      ExerciseTranslationName,
    );
    expect(exerciseTranslationName.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const exerciseTranslationNameValueObject =
      exerciseTranslationName.value as ExerciseTranslationName;
    const capitalizedExerciseTranslationNameValue = 'Exercise Test One';
    expect(exerciseTranslationNameValueObject.value).toBe(
      capitalizedExerciseTranslationNameValue,
    );
  });

  it('Should not create a exercise name value object with less than 3 characters', () => {
    const exerciseTranslationNameValue = 'Ex';
    const exerciseTranslationName = ExerciseTranslationName.create({
      value: exerciseTranslationNameValue,
    });

    expect(exerciseTranslationName.value).toEqual(
      ExerciseTranslationDomainError.create(
        ExerciseTranslationDomainError.messages.invalidName,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(exerciseTranslationName.isLeft()).toBeTruthy();
  });
});
