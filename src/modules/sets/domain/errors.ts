import { HttpStatus } from '@nestjs/common';

export class SetsDomainError extends Error {
  public readonly code: number;
  public static messages = {
    invalidNumReps: 'Num reps must be positive number',
    invalidSetsWeight: 'Sets weight must be positive number',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'sets-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new SetsDomainError(message, code);
  }
}
