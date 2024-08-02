export default class Formatter {
  public static capitalizeAll(value: string): string {
    const lowerCaseValue = value.toLowerCase().trim();
    const capitalizedValue = lowerCaseValue.split(" ").reduce((acc, word) => {
      if (acc) {
        return `${acc} ${word.charAt(0).toUpperCase()}${word.slice(1)}`;
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    }, "");

    return capitalizedValue;
  }

  public static capitalizeFirst(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
