import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: '.env',
});

export default class Env {
  static get port(): number {
    const port = this.getEnvOrDefault('PORT', '3000');

    return Number(port);
  }

  static get passwordSalt(): number {
    const passwordSalt = this.getEnvOrThrow('PASSWORD_SALT');

    return Number(passwordSalt);
  }

  static get cryptographyAlgorithm(): string {
    return this.getEnvOrThrow('ALGORITHM');
  }

  static get cryptographySecurityKey(): string {
    return this.getEnvOrThrow('ALGORITHM_SECURITY_KEY');
  }

  static get cryptographyInitVector(): string {
    return this.getEnvOrThrow('ALGORITHM_IV');
  }

  static get jwtSecret(): string {
    return this.getEnvOrThrow('JWT_SECRET');
  }

  private static getEnvOrThrow(envName: string): string {
    const env = process.env[envName];
    if (!env) {
      throw new Error(`Missing environment variable ${envName}`);
    }

    return env;
  }

  private static getEnvOrDefault(
    envName: string,
    defaultValue: string,
  ): string {
    return process.env[envName] ?? defaultValue;
  }
}
