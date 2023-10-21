import IsEmailVerified from '~/modules/users/domain/value-objects/is-email-verified';

describe('IsEmailVerified Value Objects', () => {
  it('should create a is-admin value object', () => {
    const isEmailVerified = IsEmailVerified.create(true);

    expect(isEmailVerified.value).toBe(true);
  });

  it('Should verify email', () => {
    const isEmailVerified = IsEmailVerified.create();
    expect(isEmailVerified.value).toBe(false);

    isEmailVerified.verifyEmail();
    expect(isEmailVerified.value).toBe(true);
  });

  it('Should un-verify email', () => {
    const isEmailVerified = IsEmailVerified.create(true);
    expect(isEmailVerified.value).toBe(true);

    isEmailVerified.unVerifyEmail();
    expect(isEmailVerified.value).toBe(false);
  });
});
