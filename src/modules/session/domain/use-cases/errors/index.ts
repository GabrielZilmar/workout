import { HttpStatus } from '@nestjs/common';

export class SessionUseCaseError extends Error {
  public readonly code: number;
  public readonly payload?: unknown;
  public static messages = {
    invalidPassword: 'Invalid password, try again.',
    userNotExits: (email: string) => `User with email "${email}" not exists.`,
    userIdNotFound: (id: string) => `User with id "${id}" was not found.`,
    tokenStillValid: 'Token still valid, check your email.',
  };

  constructor(message: string, code: number, payload?: unknown) {
    super(message);
    this.name = 'session-use-case';
    this.payload = payload || null;
    this.code = code;
  }

  public static create(
    message: string,
    payload?: unknown,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new SessionUseCaseError(message, code, payload);
  }
}
