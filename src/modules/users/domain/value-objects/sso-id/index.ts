import { HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch';
import { UserDomainError } from '~/modules/users/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export type SSOIdProps = {
  value: string;
};

export default class SSOId extends ValueObject<SSOIdProps> {
  private constructor(props: SSOIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static async isValid(
    ssoId: string,
  ): Promise<Either<UserDomainError, true>> {
    const ssoUrl = process.env.SSO_URL;
    const ssoPort = process.env.SSO_PORT;
    const getUserPath = `${process.env.SSO_GET_USER_PATH}/${ssoId}`;

    try {
      const ssoUser = await fetch(`${ssoUrl}:${ssoPort}${getUserPath}`);

      if (ssoUser.status === HttpStatus.OK) {
        return right(true);
      }

      return left(
        UserDomainError.create(
          UserDomainError.messages.invalidSSOId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    } catch (e) {
      return left(
        UserDomainError.create(
          UserDomainError.messages.couldNotValidateSSOId,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  public static async create(
    props: SSOIdProps,
  ): Promise<Either<UserDomainError, SSOId>> {
    const isValid = await this.isValid(props.value);
    if (isValid.isRight()) {
      return right(new SSOId(props));
    }

    return left(isValid.value);
  }
}
