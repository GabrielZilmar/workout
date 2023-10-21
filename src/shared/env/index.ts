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
