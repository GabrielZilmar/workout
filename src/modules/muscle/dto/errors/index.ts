import { HttpStatus } from '@nestjs/common';

export class MuscleDtoError extends Error {
  public readonly code: number;
  public static messages = {
    missingId: 'Could not transform to DTO. Missing ID',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'muscle-dto';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new MuscleDtoError(message, code);
  }
}
