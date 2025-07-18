import { HttpStatus } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import ExerciseTranslationInfo from '~/modules/exercise-translations/domain/value-objects/info';

type ExerciseTranslationInfoPublicClass = ExerciseTranslationInfo & {
  isValid(): boolean;
};

describe('ExerciseTranslationInfo value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('It should create a exercise info value object', () => {
    const isValidSpy = jest.spyOn(
      ExerciseTranslationInfo as unknown as ExerciseTranslationInfoPublicClass,
      'isValid',
    );

    const exerciseTranslationInfoValue = 'Exercise test info one';
    const exerciseTranslationInfo = ExerciseTranslationInfo.create({
      value: exerciseTranslationInfoValue,
    });

    expect(exerciseTranslationInfo.value).toBeInstanceOf(
      ExerciseTranslationInfo,
    );
    expect(exerciseTranslationInfo.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a exercise info value object with an empty string', () => {
    const exerciseTranslationInfoValue = '';
    const exerciseTranslationInfo = ExerciseTranslationInfo.create({
      value: exerciseTranslationInfoValue,
    });

    expect(exerciseTranslationInfo.value).toEqual(
      ExerciseTranslationDomainError.create(
        ExerciseTranslationDomainError.messages.invalidInfo,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(exerciseTranslationInfo.isLeft()).toBeTruthy();
  });
});
