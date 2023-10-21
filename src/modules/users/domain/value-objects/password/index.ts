import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { UserDomainError } from '~/modules/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';
import Env from '~/shared/env';

export const MIN_PASSWORD_LENGTH = 6;

export interface PasswordProps {
  value: string;
}

export default class Password extends ValueObject<PasswordProps> {
  private static readonly minPasswordLength = MIN_PASSWORD_LENGTH;

  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(password: string): boolean {
    return !!password && password.length >= this.minPasswordLength;
  }

  private static async hashPassword(password: string): Promise<string> {
    const hash = await bcryptHash(password, Env.passwordSalt);

    return hash;
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    const isEqual = await bcryptCompare(plainTextPassword, this.props.value);
    return isEqual;
  }

  public static async create(
    password: string,
    isHashed = false,
  ): Promise<Either<UserDomainError, Password>> {
    if (!this.isValid(password)) {
      return left(
        UserDomainError.create(UserDomainError.messages.invalidPassword),
      );
    }

    let hashedPassword = password;
    if (!isHashed) {
      hashedPassword = await this.hashPassword(password);
    }

    return right(new Password({ value: hashedPassword }));
  }
}
