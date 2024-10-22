import CreatedAt from '~/shared/domain/value-objects/created-at';
import { SharedValueObjectError } from '~/shared/domain/value-objects/errors';

type CreatedAtPublicClass = CreatedAt & {
  isValid: () => boolean;
};

describe('CreatedAt value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a created at value object with date value', () => {
    const isValidSpy = jest.spyOn(
      CreatedAt as unknown as CreatedAtPublicClass,
      'isValid',
    );

    const value = new Date();
    const createdAt = CreatedAt.create({ value });

    expect(createdAt.value).toBeInstanceOf(CreatedAt);
    expect((createdAt.value as CreatedAt).value).toBe(value);
    expect(createdAt.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalledWith(value);
  });

  it('Should create a created at value object with date string value', () => {
    const isValidSpy = jest.spyOn(
      CreatedAt as unknown as CreatedAtPublicClass,
      'isValid',
    );

    const value = new Date().toISOString();
    const createdAt = CreatedAt.create({ value });

    expect(createdAt.value).toBeInstanceOf(CreatedAt);
    expect((createdAt.value as CreatedAt).value).toBe(value);
    expect(createdAt.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalledWith(value);
  });

  it('Should not create a created at value object if value is invalid', () => {
    const value = '';
    const createdAt = CreatedAt.create({ value });

    expect(createdAt.value).toBeInstanceOf(SharedValueObjectError);
    expect((createdAt.value as SharedValueObjectError).message).toBe(
      SharedValueObjectError.messages.invalidCreatedAt,
    );
  });

  it('Should not create a created at value object if value is invalid date', () => {
    const value = '9999-99-99';
    const createdAt = CreatedAt.create({ value });

    expect(createdAt.value).toBeInstanceOf(SharedValueObjectError);
    expect((createdAt.value as SharedValueObjectError).message).toBe(
      SharedValueObjectError.messages.invalidCreatedAt,
    );
  });
});
