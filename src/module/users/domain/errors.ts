import { MAX_AGE, MIN_AGE } from '~/module/users/domain/value-objects/age';
import { MIN_USERNAME_LENGTH } from '~/module/users/domain/value-objects/username';

export class UserDomainError extends Error {
  public static messages = {
    invalidSSOId: 'Invalid SSO ID',
    invalidUsername: `Invalid Username, must be at least ${MIN_USERNAME_LENGTH} characters`,
    invalidAge: `Invalid Age, must be between ${MIN_AGE} and ${MAX_AGE}`,
  };

  constructor(message: string) {
    super(message);
    this.name = 'user-domain';
  }

  public static emit(message: string) {
    return new UserDomainError(message);
  }
}
