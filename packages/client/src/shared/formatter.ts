type MountDuplicateErrorMessageParams = {
  duplicatedItems?: Record<string, string>;
  itemName?: string;
};

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

  public static mountDuplicateErrorMessage({
    duplicatedItems,
    itemName = "Item",
  }: MountDuplicateErrorMessageParams = {}) {
    let message = `Ops.. ${itemName} already exists!`;

    if (duplicatedItems) {
      let duplicateItemsMessage = "";
      Object.entries(duplicatedItems).forEach(([key, value]) => {
        const capitalizedKey = Formatter.capitalizeAll(key);
        duplicateItemsMessage += `\n${capitalizedKey} ${value} already used.`;
      });
      message = `${message}${duplicateItemsMessage}`;
    }

    return message;
  }
}
