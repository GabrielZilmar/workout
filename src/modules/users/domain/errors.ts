import { MAX_AGE, MIN_AGE } from '~/modules/users/domain/value-objects/age';
import { MIN_HEIGHT } from '~/modules/users/domain/value-objects/height';
import { MIN_USERNAME_LENGTH } from '~/modules/users/domain/value-objects/username';
import { MIN_WEIGHT } from '~/modules/users/domain/value-objects/weight';

export class UserDomainError extends Error {
  public static messages = {
    invalidSSOId: 'Invalid SSO ID',
    invalidUsername: `Invalid Username, must be at least ${MIN_USERNAME_LENGTH} characters`,
    invalidAge: `Invalid Age, must be between ${MIN_AGE} and ${MAX_AGE}`,
    invalidWeight: `Invalid Weight, min weight is ${MIN_WEIGHT}`,
    invalidHeight: `Invalid Height, min height is ${MIN_HEIGHT}`,
    missingProps: 'Could not create the domain. Missing props',
  };

  constructor(message: string) {
    super(message);
    this.name = 'user-domain';
  }

  public static create(message: string) {
    return new UserDomainError(message);
  }
}
