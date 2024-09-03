import EmailVerification from '~/modules/users/domain/value-objects/email-verification';

describe('EmailVerification Value Objects', () => {
  it('should create a is-admin value object', () => {
    const emailVerification = EmailVerification.create({ value: true });

    expect(emailVerification.value).toBe(true);
    expect(emailVerification.isVerified).toBe(true);
  });

  it('Should verify email', () => {
    const emailVerification = EmailVerification.create();
    expect(emailVerification.value).toBe(false);
    expect(emailVerification.isVerified).toBe(false);

    emailVerification.verifyEmail();
    expect(emailVerification.value).toBe(true);
    expect(emailVerification.isVerified).toBe(true);
  });

  it('Should un-verify email', () => {
    const emailVerification = EmailVerification.create({ value: true });
    expect(emailVerification.value).toBe(true);
    expect(emailVerification.isVerified).toBe(true);

    emailVerification.unVerifyEmail();
    expect(emailVerification.value).toBe(false);
    expect(emailVerification.isVerified).toBe(false);
  });
});
