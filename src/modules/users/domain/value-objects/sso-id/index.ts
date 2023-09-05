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

  private static async isValid(ssoId: string): Promise<boolean> {
    const ssoUrl = process.env.SSO_URL;
    const ssoPort = process.env.SSO_PORT;
    const getUserPath = `${process.env.SSO_GET_USER_PATH}/${ssoId}`;

    try {
      const ssoUser = await fetch(`${ssoUrl}:${ssoPort}${getUserPath}`);

      if (ssoUser.status === HttpStatus.OK) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  public static async create(
    props: SSOIdProps,
  ): Promise<Either<UserDomainError, SSOId>> {
    const isValid = await this.isValid(props.value);
    if (isValid) {
      return right(new SSOId(props));
    }

    return left(UserDomainError.create(UserDomainError.messages.invalidSSOId));
  }
}
