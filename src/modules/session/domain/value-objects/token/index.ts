import { JwtPayload } from 'jsonwebtoken';
import SessionDomainError from '~/modules/session/domain/errors';
import Crypto from '~/services/cryptography/crypto';
import JwtService from '~/services/jwt/jsonwebtoken';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export type TokenProps = {
  value: string;
  isAuth: boolean;
  isEncrypted: boolean;
  expiry: Date;
  usedAt: Date | null;
};

export type TokenCreateProps = Partial<TokenProps> & { value: string };

export type TokenOptions = {
  expiresIn?: string;
  isEncrypted?: boolean;
  usedAt?: Date | null;
};

export default class Token extends ValueObject<TokenProps> {
  private constructor(
    props: TokenProps,
    private readonly jwtService: JwtService,
    private readonly cryptoService: Crypto,
  ) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  get isAuth(): boolean {
    let tokenValue = this.props.value;
    if (this.isEncrypted) {
      tokenValue = this.getDecryptValue();
    }

    const isExpired = this.jwtService.isTokenExpired(tokenValue);
    this.props.isAuth = !isExpired;

    return this.props.isAuth;
  }

  get isEncrypted(): boolean {
    return this.props.isEncrypted ?? false;
  }

  get usedAt(): Date | null {
    return this.props.usedAt;
  }

  // TODO: Use token

  public async getDecodedValue<T>(): Promise<T | null> {
    let tokenValue = this.props.value;
    if (this.isEncrypted) {
      tokenValue = this.getDecryptValue();
    }

    return this.jwtService.decodeToken(tokenValue) as T | null;
  }

  public getEncryptValue(): string {
    if (this.isEncrypted) {
      return this.props.value;
    }

    const encryptedData = this.cryptoService.encryptValue(this.props.value);
    this.props.value = encryptedData;
    this.props.isEncrypted = true;

    return encryptedData;
  }

  public getDecryptValue(): string {
    if (!this.isEncrypted) {
      return this.props.value;
    }

    return Token.decryptValue(this.props.value, this.cryptoService);
  }

  public useToken(): void {
    this.props.usedAt = new Date();
  }

  private static decryptValue(value: string, cryptoService: Crypto): string {
    return cryptoService.decryptValue(value);
  }

  private static isValid<T>(props: T | string): boolean {
    const objectType = typeof props === 'object' && !Array.isArray(props);
    const isValidObject = !!props && (objectType || typeof props === 'string');

    return isValidObject;
  }

  public static create<T extends JwtPayload>(
    props: T | string,
    options = {} as TokenOptions,
  ): Either<SessionDomainError, Token> {
    const { expiresIn, isEncrypted = false, usedAt = null } = options;
    if (!this.isValid<T>(props)) {
      return left(
        SessionDomainError.create(SessionDomainError.messages.invalidToken),
      );
    }

    const jwtService = new JwtService();
    const cryptoService = new Crypto();

    let token: string;
    if (isEncrypted) {
      token = this.decryptValue(props as string, cryptoService);
    } else {
      token = jwtService.signToken(props as T, expiresIn);
    }

    const isAuth = !jwtService.isTokenExpired(token);
    const expiry = new Date((jwtService.decodeToken(token)?.exp ?? 0) * 1000);

    return right(
      new Token(
        { value: token, isAuth, isEncrypted: false, expiry, usedAt },
        jwtService,
        cryptoService,
      ),
    );
  }
}
