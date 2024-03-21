import { HttpStatus } from '@nestjs/common';
import { SetsDomainError } from '~/modules/sets/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

type NumRepsProps = {
  value: number;
};

export default class NumReps extends ValueObject<NumRepsProps> {
  private constructor(props: NumRepsProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  private static isValid(numReps: number): boolean {
    return numReps >= 0;
  }

  public static create(props: NumRepsProps): Either<SetsDomainError, NumReps> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        SetsDomainError.create(
          SetsDomainError.messages.invalidNumReps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new NumReps(props));
  }
}
