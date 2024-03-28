import { HttpStatus } from '@nestjs/common';

export class UserUseCaseError extends Error {
  public readonly code: number;
  public readonly payload?: unknown;
  public static messages = {
    userNotFound: (item: string) => `User ${item} not found.`,
  };

  constructor(message: string, code: number, payload?: unknown) {
    super(message);
    this.name = 'user-use-case';
    this.payload = payload || null;
    this.code = code;
  }

  public static create(
    message: string,
    payload?: unknown,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new UserUseCaseError(message, code, payload);
  }
}
