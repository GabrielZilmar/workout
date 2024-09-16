import { ConfigModule } from '@nestjs/config';

export enum Environment {
  LOCAL = 'local',
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

ConfigModule.forRoot({
  envFilePath: '.env',
});

export default class Env {
  static get port(): number {
    const port = this.getEnvOrDefault('PORT', '3030');

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

  static get emailHost(): string {
    return this.getEnvOrDefault('EMAIL_HOST', 'smtp.gmail.com');
  }

  static get emailPort(): number {
    const emailPort = this.getEnvOrDefault('EMAIL_PORT', '465');

    return Number(emailPort);
  }

  static get emailService(): string {
    return this.getEnvOrDefault('EMAIL_SERVICE', 'gmail');
  }

  static get emailSender(): string {
    return this.getEnvOrThrow('EMAIL_SENDER');
  }

  static get emailPassword(): string {
    return this.getEnvOrThrow('EMAIL_PASSWORD');
  }

  static get verifyEmailUrl(): string {
    return this.getEnvOrThrow('VERIFY_EMAIL_URL');
  }

  static get recoverPasswordUrl(): string {
    return this.getEnvOrThrow('RECOVER_PASSWORD_URL');
  }

  static get adminPassword(): string {
    return this.getEnvOrThrow('ADMIN_PASSWORD');
  }

  static get adminEmail(): string {
    return this.getEnvOrThrow('ADMIN_EMAIL');
  }

  static get adminUsername(): string {
    return this.getEnvOrThrow('ADMIN_USERNAME');
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
