import { HttpStatus } from '@nestjs/common';
import { MAX_AGE, MIN_AGE } from '~/modules/users/domain/value-objects/age';
import { MIN_HEIGHT } from '~/modules/users/domain/value-objects/height';
import { MIN_PASSWORD_LENGTH } from '~/modules/users/domain/value-objects/password';
import { MIN_USERNAME_LENGTH } from '~/modules/users/domain/value-objects/username';
import { MIN_WEIGHT } from '~/modules/users/domain/value-objects/weight';

export class UserDomainError extends Error {
  public readonly code: number;
  public static messages = {
    internalError: 'Internal Error. Try again later',
    invalidUsername: `Invalid Username, must be at least ${MIN_USERNAME_LENGTH} characters`,
    invalidAge: `Invalid Age, must be between ${MIN_AGE} and ${MAX_AGE}`,
    invalidWeight: `Invalid Weight, min weight is ${MIN_WEIGHT}`,
    invalidHeight: `Invalid Height, min height is ${MIN_HEIGHT}`,
    missingProps: 'Could not create the domain. Missing props',
    invalidEmail: 'Invalid email! Please, insert a valid email.',
    invalidPassword: `Invalid password, min length is ${MIN_PASSWORD_LENGTH}'`,
  };

  constructor(message: string, code: number) {
    super(message);
    this.name = 'user-domain';
    this.code = code;
  }

  public static create(
    message: string,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new UserDomainError(message, code);
  }
}
