import { MAX_AGE, MIN_AGE } from '~/module/users/domain/value-objects/age';
import { MIN_USERNAME_LENGTH } from '~/module/users/domain/value-objects/username';

export enum UserDomainErrors {
  invalidSSOId = 'Invalid SSO ID',
  invalidUsername = `Invalid Username, must be at least ${MIN_USERNAME_LENGTH} characters`,
  invalidAge = `Invalid Age, must be between ${MIN_AGE} and ${MAX_AGE}`,
}

export class UserDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'user-domain';
  }
}

export const userDomainError = (message: string): UserDomainError =>
  new UserDomainError(message);
