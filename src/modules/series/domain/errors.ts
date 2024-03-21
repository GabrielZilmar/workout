import { HttpStatus } from '@nestjs/common';

export class SeriesDomainError extends Error {
  public readonly code: number;
  public static messages = {
    invalidNumReps: 'Num reps must be positive number',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'series-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new SeriesDomainError(message, code);
  }
}
