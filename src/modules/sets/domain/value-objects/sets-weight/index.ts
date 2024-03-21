import { HttpStatus } from '@nestjs/common';
import { SetsDomainError } from '~/modules/sets/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export type SetsWeightProps = {
  value: number; // In Kg.
};

export default class SetsWeight extends ValueObject<SetsWeightProps> {
  get value() {
    return this.props.value;
  }

  private static isValid(value: number) {
    return value > 0;
  }

  public static create(
    props: SetsWeightProps,
  ): Either<SetsDomainError, SetsWeight> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        SetsDomainError.create(
          SetsDomainError.messages.invalidSetsWeight,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new SetsWeight(props));
  }
}
