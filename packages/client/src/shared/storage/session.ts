type SetItemParams = {
  key: string;
  value: string;
};

export const SESSION_ITEMS = {
  accessToken: "ACCESS_TOKEN",
};

export default class SessionStorage {
  public static setItem({ key, value }: SetItemParams): void {
    sessionStorage.setItem(key, value);
  }

  public static getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  public static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  public static clear(): void {
    sessionStorage.clear();
  }
}
