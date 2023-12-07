import { JwtPayload } from 'jsonwebtoken';
import Token from '~/modules/session/domain/value-objects/token';
import Crypto from '~/services/cryptography/crypto';
import JwtService from '~/services/jwt/jsonwebtoken';

describe('Token Value Object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type TokenPublicClass = Token & {
    isValid(): boolean;
    decryptValue(value: string, cryptoService: Crypto): string;
  };

  it('should create a token value object', async () => {
    const isValidSpy = jest.spyOn(
      Token as unknown as TokenPublicClass,
      'isValid',
    );

    const tokenValue = 'valid_token';
    const token = Token.create({ value: tokenValue });

    expect(token.isRight()).toBeTruthy();
    expect(token.value).toBeInstanceOf(Token);
    expect(isValidSpy).toHaveBeenCalled();

    const tokenValueObject = token.value as Token;
    const jwtService = new JwtService();
    const encryptedValue = jwtService.signToken({ value: tokenValue });
    expect(tokenValueObject.value).toBe(encryptedValue);

    const decodedValue =
      (await tokenValueObject.getDecodedValue()) as JwtPayload;
    expect(decodedValue.value).toBe(tokenValue);
  });

  it('Should create a token value object with encrypted value', () => {
    const isValidSpy = jest.spyOn(
      Token as unknown as TokenPublicClass,
      'isValid',
    );
    const decryptValueSpy = jest.spyOn(
      Token as unknown as TokenPublicClass,
      'decryptValue',
    );

    const tokenValue = { value: 'valid_token' };
    const token = Token.create(tokenValue, { isEncrypted: true });

    expect(token.isRight()).toBeTruthy();
    expect(token.value).toBeInstanceOf(Token);
    expect(isValidSpy).toHaveBeenCalled();
    expect(decryptValueSpy).toHaveBeenCalled();

    const tokenValueObject = token.value as Token;
    expect(tokenValueObject.value).toBe(tokenValue);
  });
});
