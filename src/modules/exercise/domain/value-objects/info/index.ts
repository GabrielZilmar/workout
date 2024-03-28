import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

type ExerciseInfoProps = {
  value: string;
};

export default class ExerciseInfo extends ValueObject<ExerciseInfoProps> {
  private constructor(props: ExerciseInfoProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(info: string): boolean {
    return !!info;
  }

  public static create(
    props: ExerciseInfoProps,
  ): Either<ExerciseDomainError, ExerciseInfo> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        ExerciseDomainError.create(
          ExerciseDomainError.messages.invalidExerciseInfo,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new ExerciseInfo(props));
  }
}
