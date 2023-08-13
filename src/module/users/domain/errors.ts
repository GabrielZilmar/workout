export enum UserDomainErrors {
  invalidSSOId = 'Invalid SSO ID',
}

export class UserDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'user-domain';
  }
}

export const userDomainError = (message: string): UserDomainError =>
  new UserDomainError(message);
