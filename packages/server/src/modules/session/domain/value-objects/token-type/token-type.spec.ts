import SessionDomainError from '~/modules/session/domain/errors';
import TokenType from '~/modules/session/domain/value-objects/token-type';
import {
  TOKEN_TYPES_ENUM,
  TokenTypes,
} from '~/modules/session/entities/token.entity';

describe('Token Type Value Object', () => {
  type TokenTypePublicClass = TokenType & {
    isValid(): boolean;
  };

  it('Should create a token type value object', async () => {
    const isValidSpy = jest.spyOn(
      TokenType as unknown as TokenTypePublicClass,
      'isValid',
    );

    const tokenTypesEnumLength = TOKEN_TYPES_ENUM.length;
    const randomType = TOKEN_TYPES_ENUM[
      Math.floor(Math.random() * tokenTypesEnumLength)
    ] as TokenTypes;
    const tokenType = TokenType.create(randomType);

    expect(tokenType.isRight()).toBeTruthy();
    expect(tokenType.value).toBeInstanceOf(TokenType);
    expect(isValidSpy).toHaveBeenCalled();

    const tokenTypeValueObject = tokenType.value as TokenType;
    expect(tokenTypeValueObject.value).toBe(randomType);
  });

  it('Should not create a token type value object with invalid type', async () => {
    const isValidSpy = jest.spyOn(
      TokenType as unknown as TokenTypePublicClass,
      'isValid',
    );

    const invalidType = 'invalid_type' as TokenTypes;
    const tokenType = TokenType.create(invalidType);

    expect(tokenType.isLeft()).toBeTruthy();
    expect(tokenType.value).toBeInstanceOf(Error);
    expect(isValidSpy).toHaveBeenCalled();

    const tokenTypeValueObject = tokenType.value as SessionDomainError;
    expect(tokenTypeValueObject.message).toBe(
      SessionDomainError.messages.invalidType,
    );
  });
});
