import { HttpStatus } from '@nestjs/common';

export class SetDomainError extends Error {
  public readonly code: number;
  public static messages = {
    missingProps: 'Missing props to create set',
    invalidNumReps: 'Num reps must be positive number',
    invalidSetWeight: 'Set weight must be positive number',
    invalidNumDrops: 'Num drops must be positive number',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'set-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new SetDomainError(message, code);
  }
}
