import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { isStrongPassword } from 'class-validator';
import { UserDomainError } from '~/modules/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';
import Env from '~/shared/env';

export const MIN_PASSWORD_LENGTH = 6;

export type PasswordProps = {
  value: string;
};

export type CreatePasswordParams = {
  value: string;
  isHashed?: boolean;
};

export default class Password extends ValueObject<PasswordProps> {
  private static readonly minPasswordLength = MIN_PASSWORD_LENGTH;

  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(password: string): boolean {
    return (
      !!password &&
      isStrongPassword(password, { minLength: this.minPasswordLength })
    );
  }

  private static async hashPassword(password: string): Promise<string> {
    const hash = await bcryptHash(password, Env.passwordSalt);

    return hash;
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    const isEqual = await bcryptCompare(plainTextPassword, this.props.value);
    return isEqual;
  }

  public static async create({
    value,
    isHashed = false,
  }: CreatePasswordParams): Promise<Either<UserDomainError, Password>> {
    if (!this.isValid(value)) {
      return left(
        UserDomainError.create(UserDomainError.messages.invalidPassword),
      );
    }

    let hashedPassword = value;
    if (!isHashed) {
      hashedPassword = await this.hashPassword(value);
    }

    return right(new Password({ value: hashedPassword }));
  }
}
