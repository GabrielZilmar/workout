export default class Env {
  static get port(): number {
    const port = this.getEnvOrDefault('PORT', '3000');

    return Number(port);
  }

  static get passwordSalt(): string {
    return this.getEnvOrThrow('PASSWORD_SALT');
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
