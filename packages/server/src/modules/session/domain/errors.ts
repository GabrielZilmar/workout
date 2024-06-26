import { HttpStatus } from '@nestjs/common';

export default class SessionDomainError extends Error {
  public readonly code: number;
  public static messages = {
    invalidSessionProps: "Couldn't create the session. Invalid props",
    invalidType: 'Token type is not valid',
    invalidToken: 'Token is not valid. Invalid signature ou invalid format.',
    invalidTokenProps: "Couldn't create the token. Invalid props",
    tokenNotAuth: 'Token is not authenticated',
  };

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = 'session-domain';
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new SessionDomainError(message, code);
  }
}
