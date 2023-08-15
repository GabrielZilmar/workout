import { UserDomainError } from '~/module/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export const MIN_WEIGHT = 36;

export type WeightProps = {
  value: number;
};

export default class Weight extends ValueObject<WeightProps> {
  private constructor(props: WeightProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  private static isValid(value: number) {
    return value < MIN_WEIGHT;
  }

  public static create(props: WeightProps): Either<UserDomainError, Weight> {
    const isValid = !this.isValid(props.value);
    if (!isValid) {
      return left(UserDomainError.emit(UserDomainError.messages.invalidWeight));
    }

    return right(new Weight(props));
  }
}
