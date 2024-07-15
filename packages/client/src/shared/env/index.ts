export default class Env {
  static get apiBaseUrl(): string {
    const apiBaseUrl = this.getEnvOrThrow("VITE_API_BASE_URL");

    return apiBaseUrl;
  }

  private static getEnvOrThrow(envName: string): string {
    const env = import.meta.env[envName];
    if (!env) {
      throw new Error(`Missing environment variable ${envName}`);
    }

    return env;
  }
}
