import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import Env from '~/shared/env';

@Injectable()
export default class Crypto {
  private readonly algorithm: string;
  private readonly securityKey: Buffer;
  private readonly initVector: Buffer;

  constructor() {
    this.algorithm = Env.cryptographyAlgorithm;
    this.securityKey = Buffer.from(Env.cryptographySecurityKey, 'base64url');
    this.initVector = Buffer.from(Env.cryptographyInitVector, 'base64url');
  }

  public encryptValue(value: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.securityKey,
      this.initVector,
    );

    let encryptedData = cipher.update(value, 'utf-8', 'base64url');
    encryptedData += cipher.final('base64url');

    return encryptedData;
  }

  public decryptValue(value: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.securityKey,
      this.initVector,
    );

    let decryptedData = decipher.update(value, 'base64url', 'utf-8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }
}
