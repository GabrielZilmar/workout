import { UserDomainError } from '~/modules/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export type EmailProps = {
  value: string;
};

export default class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  private static isValid(value: string): boolean {
    const validateEmailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return validateEmailRegex.test(value);
  }

  static create(props: EmailProps): Either<UserDomainError, Email> {
    if (!this.isValid(props.value)) {
      return left(
        UserDomainError.create(UserDomainError.messages.invalidEmail),
      );
    }

    props.value = props.value.toLowerCase();
    return right(new Email(props));
  }
}
