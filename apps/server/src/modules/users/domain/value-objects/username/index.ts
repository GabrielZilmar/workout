import { HttpStatus } from '@nestjs/common';
import { UserDomainError } from '~/modules/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export const MIN_USERNAME_LENGTH = 4;

export type UsernameProps = {
  value: string;
};

export default class Username extends ValueObject<UsernameProps> {
  public readonly minSize: number;

  private constructor(props: UsernameProps) {
    super(props);
    this.minSize = MIN_USERNAME_LENGTH;
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(username: string): boolean {
    return username.length >= MIN_USERNAME_LENGTH;
  }

  public static create(
    props: UsernameProps,
  ): Either<UserDomainError, Username> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        UserDomainError.create(
          UserDomainError.messages.invalidUsername,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    props.value = props.value.toLowerCase();
    return right(new Username(props));
  }
}
