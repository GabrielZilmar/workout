import { JwtPayload } from 'jsonwebtoken';
import Token from '~/modules/session/domain/value-objects/token';
import Crypto from '~/services/cryptography/crypto';
import JwtService from '~/services/jwt/jsonwebtoken';

describe('Token Value Object', () => {
  type TokenPublicClass = Token & {
    isValid(): boolean;
    decryptValue(value: string, cryptoService: Crypto): string;
  };

  const cryptoService = new Crypto();
  const jwtService = new JwtService();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a token value object', async () => {
    const isValidSpy = jest.spyOn(
      Token as unknown as TokenPublicClass,
      'isValid',
    );
    const decryptValueSpy = jest.spyOn(
      Token as unknown as TokenPublicClass,
      'decryptValue',
    );

    const tokenValue = 'valid_token';
    const token = Token.create({ value: tokenValue });

    expect(token.isRight()).toBeTruthy();
    expect(token.value).toBeInstanceOf(Token);
    expect(isValidSpy).toHaveBeenCalled();
    expect(decryptValueSpy).not.toHaveBeenCalled();

    const tokenValueObject = token.value as Token;

    const encryptedValue = jwtService.signToken({ value: tokenValue });
    expect(tokenValueObject.value).toBe(encryptedValue);

    const decodedValue =
      (await tokenValueObject.getDecodedValue()) as JwtPayload;
    expect(decodedValue.value).toBe(tokenValue);
  });

  it('Should create a token value object with encrypted value', async () => {
    const isValidSpy = jest.spyOn(
      Token as unknown as TokenPublicClass,
      'isValid',
    );
    const decryptValueSpy = jest.spyOn(
      Token as unknown as TokenPublicClass,
      'decryptValue',
    );

    const tokenValue = 'valid_token';
    const jwtToken = jwtService.signToken({ value: tokenValue });
    const encryptedValue = cryptoService.encryptValue(jwtToken);
    const token = Token.create(encryptedValue, {
      isEncrypted: true,
    });

    expect(token.isRight()).toBeTruthy();
    expect(token.value).toBeInstanceOf(Token);
    expect(isValidSpy).toHaveBeenCalled();
    expect(decryptValueSpy).toHaveBeenCalled();

    const tokenValueObject = token.value as Token;
    expect(tokenValueObject.value).toBe(jwtToken);

    const decodedValue =
      (await tokenValueObject.getDecodedValue()) as JwtPayload;
    expect(decodedValue.value).toBe(tokenValue);
  });

  it('Should decode the token value', async () => {
    const tokenValue = {
      name: 'token',
      value: 'token_value',
    };

    const token = Token.create(tokenValue);
    const tokenValueObject = token.value as Token;

    const decodedValue =
      (await tokenValueObject.getDecodedValue()) as JwtPayload;

    expect(decodedValue).toEqual({
      ...tokenValue,
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('Should encrypt and decrypt the token value', () => {
    const tokenValue = {
      name: 'token',
      value: 'token_value',
    };

    const token = Token.create(tokenValue);
    const jwtToken = jwtService.signToken(tokenValue);
    const tokenValueObject = token.value as Token;

    const encryptedValue = tokenValueObject.getEncryptValue();
    const decryptValue = tokenValueObject.getDecryptValue();
    expect(encryptedValue).not.toBe(jwtToken);
    expect(decryptValue).toBe(jwtToken);
  });

  it('Should create a token value object with usedAt', () => {
    const tokenValue = {
      name: 'token',
      value: 'token_value',
    };

    let token = Token.create(tokenValue);
    expect(token.isRight()).toBeTruthy();
    expect((token.value as Token).usedAt).toBeNull();

    const usedAt = new Date();
    token = Token.create(tokenValue, { usedAt });
    expect(token.isRight()).toBeTruthy();
    expect((token.value as Token).usedAt).toBe(usedAt);
  });

  it('Should use the token', () => {
    const tokenValue = {
      name: 'token',
      value: 'token_value',
    };

    const token = Token.create(tokenValue);
    expect(token.isRight()).toBeTruthy();

    const tokenValueObject = token.value as Token;
    expect(tokenValueObject.usedAt).toBeNull();

    tokenValueObject.useToken();
    expect(tokenValueObject.usedAt).toBeInstanceOf(Date);

    const usedAt = new Date();
    tokenValueObject.useToken(usedAt);
    expect(tokenValueObject.usedAt).toBe(usedAt);
  });
});
