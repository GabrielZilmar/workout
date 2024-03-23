import { HttpStatus } from '@nestjs/common';
import { SetDomainError } from '~/modules/set/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export type SetWeightProps = {
  value: number; // In Kg.
};

export default class SetWeight extends ValueObject<SetWeightProps> {
  get value() {
    return this.props.value;
  }

  private static isValid(value: number) {
    return value > 0;
  }

  public static create(
    props: SetWeightProps,
  ): Either<SetDomainError, SetWeight> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        SetDomainError.create(
          SetDomainError.messages.invalidSetWeight,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new SetWeight(props));
  }
}
