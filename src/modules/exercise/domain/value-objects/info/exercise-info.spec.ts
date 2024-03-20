import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseInfo from '~/modules/exercise/domain/value-objects/info';

type ExerciseInfoPublicClass = ExerciseInfo & {
  isValid(): boolean;
};

describe('ExerciseInfo value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('It should create a exercise info value object', () => {
    const isValidSpy = jest.spyOn(
      ExerciseInfo as unknown as ExerciseInfoPublicClass,
      'isValid',
    );

    const exerciseInfoValue = 'Exercise test info one';
    const exerciseInfo = ExerciseInfo.create({ value: exerciseInfoValue });

    expect(exerciseInfo.value).toBeInstanceOf(ExerciseInfo);
    expect(exerciseInfo.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a exercise info value object with an empty string', () => {
    const exerciseInfoValue = '';
    const exerciseInfo = ExerciseInfo.create({ value: exerciseInfoValue });

    expect(exerciseInfo.value).toEqual(
      ExerciseDomainError.create(
        ExerciseDomainError.messages.invalidExerciseInfo,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(exerciseInfo.isLeft()).toBeTruthy();
  });
});
