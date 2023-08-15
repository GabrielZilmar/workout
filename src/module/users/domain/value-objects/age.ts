import { UserDomainError } from '~/module/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export const MIN_AGE = 12;
export const MAX_AGE = 100;

export type AgeProps = {
  value: number;
};

export default class Age extends ValueObject<AgeProps> {
  private constructor(props: AgeProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  private static isValid(age: number): boolean {
    return age > MIN_AGE && age < MAX_AGE;
  }

  public static async create(
    props: AgeProps,
  ): Promise<Either<UserDomainError, Age>> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(UserDomainError.emit(UserDomainError.messages.invalidAge));
    }

    const age = new Age(props);
    return right(age);
  }
}
