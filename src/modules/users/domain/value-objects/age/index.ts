import { UserDomainError } from '~/modules/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export const MIN_AGE = 12;
export const MAX_AGE = 100;

export type AgeProps = {
  value: number;
};

export default class Age extends ValueObject<AgeProps> {
  public readonly minAge: number;
  public readonly maxAge: number;

  private constructor(props: AgeProps) {
    super(props);
    this.maxAge = MAX_AGE;
    this.minAge = MIN_AGE;
  }

  get value(): number {
    return this.props.value;
  }

  private static isValid(age: number): boolean {
    return age > MIN_AGE && age < MAX_AGE;
  }

  public static create(props: AgeProps): Either<UserDomainError, Age> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(UserDomainError.create(UserDomainError.messages.invalidAge));
    }

    const age = new Age(props);
    return right(age);
  }
}
