import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseDomain, {
  ExerciseDomainCreateParams,
  ExerciseDomainProps,
} from '~/modules/exercise/domain/exercise.domain';
import { Either, left } from '~/shared/either';

type ExerciseDomainPublicClass = ExerciseDomain & {
  idValid: () => boolean;
  mountValueObjects: (
    props: ExerciseDomainCreateParams,
  ) => Either<ExerciseDomainError, ExerciseDomainProps>;
};

describe('ExerciseDomain', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create a exercise domain', () => {
    const exerciseParams = ExerciseDomainMock.getExerciseCreateParams();
    const exercise = ExerciseDomain.create(exerciseParams);

    expect(exercise.isRight()).toBeTruthy();
    expect(exercise.value).toBeInstanceOf(ExerciseDomain);

    const exerciseProps = ExerciseDomainMock.getExerciseDomainProps();
    expect({ ...(exercise.value as ExerciseDomain).props }).toEqual(
      exerciseProps,
    );
    expect((exercise.value as ExerciseDomain).name.value).toBe(
      exerciseParams.name,
    );
    expect((exercise.value as ExerciseDomain).muscleId).toBe(
      exerciseParams.muscleId,
    );
    expect((exercise.value as ExerciseDomain).info?.value).toBe(
      exerciseParams.info,
    );
    expect((exercise.value as ExerciseDomain).tutorialUrl?.value).toBe(
      exerciseParams.tutorialUrl,
    );
  });

  it('Should not create a exercise with invalid props', () => {
    const exerciseParams = ExerciseDomainMock.getExerciseCreateParams({
      name: '',
      muscleId: '',
    });
    const exercise = ExerciseDomain.create(exerciseParams);

    expect(exercise.isLeft()).toBeTruthy();
    expect(exercise.value).toEqual(
      ExerciseDomainError.create(
        ExerciseDomainError.messages.missingProps,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not create a exercise if mount value objects fails', () => {
    const mockErrorMessage = 'Error';
    const mockErrorCode = 500;
    const mockError = ExerciseDomainError.create(
      mockErrorMessage,
      mockErrorCode,
    );

    jest
      .spyOn(
        ExerciseDomain as unknown as ExerciseDomainPublicClass,
        'mountValueObjects',
      )
      .mockReturnValueOnce(left(mockError));

    const exerciseParams = ExerciseDomainMock.getExerciseCreateParams();
    const exercise = ExerciseDomain.create(exerciseParams);

    expect(exercise.isLeft()).toBeTruthy();
    expect(exercise.value).toEqual(mockError);
  });

  it('Should update a exercise domain', () => {
    const exercise = ExerciseDomainMock.mountExerciseDomain();
    const updateParams = { name: 'new name', muscleId: 'new-muscle-id' };
    expect(exercise.muscleId).not.toBe(updateParams.muscleId);
    expect(exercise.name.value).not.toBe(updateParams.name);

    const updatedExercise = exercise.update(updateParams);

    expect(updatedExercise.isRight()).toBeTruthy();
    expect(updatedExercise.value).toBeInstanceOf(ExerciseDomain);
    expect((updatedExercise.value as ExerciseDomain).muscleId).toBe(
      updateParams.muscleId,
    );
  });

  it('Should not update an exercise if a vo is invalid', () => {
    const exercise = ExerciseDomainMock.mountExerciseDomain();
    const updateParams = { name: 'a' };
    const updatedExercise = exercise.update(updateParams);

    expect(updatedExercise.isLeft()).toBeTruthy();
    expect(updatedExercise.value).toEqual(
      ExerciseDomainError.create(
        ExerciseDomainError.messages.invalidExerciseName,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
