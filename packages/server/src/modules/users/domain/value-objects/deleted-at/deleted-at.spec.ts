import DeletedAt from '~/modules/users/domain/value-objects/deleted-at';

describe('DeletedAt Value Objects', () => {
  it('should create a deleted-at value object', () => {
    const date = new Date();
    let deletedAt = DeletedAt.create({ value: date });

    expect(deletedAt.value).toBe(date);

    deletedAt = DeletedAt.create();
    expect(deletedAt.value).toBeNull();
  });

  it('Should deleted', () => {
    const deletedAt = DeletedAt.create();
    expect(deletedAt.value).toBeNull();

    deletedAt.delete();
    expect(deletedAt.value).toBeInstanceOf(Date);
  });
});
