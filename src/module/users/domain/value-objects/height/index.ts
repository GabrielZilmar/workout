import { UserDomainError } from '~/module/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export const MIN_HEIGHT = 140; // 140cm

export type HeightProps = {
  value: number; // In cm
};

export default class Height extends ValueObject<HeightProps> {
  public readonly minHeight: number;

  private constructor(props: HeightProps) {
    super(props);
    this.minHeight = MIN_HEIGHT;
  }

  get value() {
    return this.props.value;
  }

  private static isValid(value: number) {
    return value >= MIN_HEIGHT;
  }

  static create(props: HeightProps): Either<UserDomainError, Height> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        UserDomainError.create(UserDomainError.messages.invalidHeight),
      );
    }

    return right(new Height(props));
  }
}
