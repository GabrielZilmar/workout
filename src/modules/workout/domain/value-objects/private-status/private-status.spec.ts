import PrivateStatus from '~/modules/workout/domain/value-objects/private-status';

describe('PrivateStatus Value Objects', () => {
  it('Should create a private-status value object', () => {
    let privateStatus = PrivateStatus.create({ value: true });
    expect(privateStatus.value).toBe(true);

    privateStatus = PrivateStatus.create({ value: false });
    expect(privateStatus.value).toBe(false);
  });

  it('Should set private', () => {
    const privateStatus = PrivateStatus.create();
    expect(privateStatus.value).toBe(false);

    privateStatus.setPrivate();
    expect(privateStatus.value).toBe(true);
  });

  it('Should unset private', () => {
    const privateStatus = PrivateStatus.create({ value: true });
    expect(privateStatus.value).toBe(true);

    privateStatus.unsetPrivate();
    expect(privateStatus.value).toBe(false);
  });

  it('Should check if is private', () => {
    const privateStatus = PrivateStatus.create({ value: true });
    expect(privateStatus.isPrivate()).toBe(true);
  });
});
