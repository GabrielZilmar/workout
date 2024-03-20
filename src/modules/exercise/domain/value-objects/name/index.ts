import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';
import UtilFormatter from '~/shared/utils/formatter';

export const MIN_EXERCISE_NAME_LENGTH = 3;

type ExerciseNameProps = {
  value: string;
};

export default class ExerciseName extends ValueObject<ExerciseNameProps> {
  private constructor(props: ExerciseNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(exercise: string): boolean {
    return exercise.length >= MIN_EXERCISE_NAME_LENGTH;
  }

  public static create(
    props: ExerciseNameProps,
  ): Either<ExerciseDomainError, ExerciseName> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        ExerciseDomainError.create(
          ExerciseDomainError.messages.invalidExerciseName,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    props.value = UtilFormatter.capitalize(props.value);
    return right(new ExerciseName(props));
  }
}
