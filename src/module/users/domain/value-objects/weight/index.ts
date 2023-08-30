import { UserDomainError } from '~/module/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export const MIN_WEIGHT = 36; // 36Kg

export type WeightProps = {
  value: number; // In Kg
};

export default class Weight extends ValueObject<WeightProps> {
  public readonly minWeight: number;

  private constructor(props: WeightProps) {
    super(props);
    this.minWeight = MIN_WEIGHT;
  }

  get value() {
    return this.props.value;
  }

  private static isValid(value: number) {
    return value >= MIN_WEIGHT;
  }

  public static create(props: WeightProps): Either<UserDomainError, Weight> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        UserDomainError.create(UserDomainError.messages.invalidWeight),
      );
    }

    return right(new Weight(props));
  }
}