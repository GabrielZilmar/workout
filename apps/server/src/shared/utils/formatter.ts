export default class UtilFormatter {
  public static capitalize(value: string): string {
    const lowerCaseValue = value.toLowerCase().trim();
    const capitalizedValue = lowerCaseValue.split(' ').reduce((acc, word) => {
      if (acc) {
        return `${acc} ${word.charAt(0).toUpperCase()}${word.slice(1)}`;
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    }, '');

    return capitalizedValue;
  }
}
