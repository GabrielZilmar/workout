import { HttpStatus } from '@nestjs/common';
import { MIN_MUSCLE_NAME_LENGTH } from '~/modules/muscle/domain/value-objects/name';

export class MuscleDomainError extends Error {
  public readonly code: number;
  public static messages = {
    invalidMuscleName: `Invalid muscle name, must be at least ${MIN_MUSCLE_NAME_LENGTH} characters`,
    missingProps: 'Missing the muscle name to create it',
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'muscle-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new MuscleDomainError(message, code);
  }
}
