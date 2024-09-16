export default class Validator {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  public static regexPasswordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

  public static isString(value: unknown): boolean {
    return typeof value === "string" || value instanceof String;
  }
}
