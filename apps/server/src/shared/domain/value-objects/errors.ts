import { HttpStatus } from '@nestjs/common';

export class SharedValueObjectError extends Error {
  public readonly code: number;
  public static messages = {
    invalidOrder: 'The order must be greater than or equal 0',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'shared-value-object';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new SharedValueObjectError(message, code);
  }
}
