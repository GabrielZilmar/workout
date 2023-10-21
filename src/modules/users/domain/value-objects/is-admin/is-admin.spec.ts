import IsAdmin from '~/modules/users/domain/value-objects/is-admin';

describe('IsAdmin Value Objects', () => {
  it('should create a is-admin value object', () => {
    const isAdmin = IsAdmin.create(true);

    expect(isAdmin.value).toBe(true);
  });

  it('Should set admin', () => {
    const isAdmin = IsAdmin.create();
    expect(isAdmin.value).toBe(false);

    isAdmin.setAdmin();
    expect(isAdmin.value).toBe(true);
  });

  it('Should unset admin', () => {
    const isAdmin = IsAdmin.create(true);
    expect(isAdmin.value).toBe(true);

    isAdmin.unsetAdmin();
    expect(isAdmin.value).toBe(false);
  });
});
