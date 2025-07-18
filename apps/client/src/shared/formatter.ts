type MountDuplicateErrorMessageParams = {
  duplicatedItems?: Record<string, string>;
  itemName?: string;
  t?: ReturnType<typeof import("next-intl").createTranslator>;
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
    t,
  }: MountDuplicateErrorMessageParams = {}) {
    let message = t
      ? t("Formatter.errors.duplicate.itemExists", { item: itemName })
      : `Ops.. ${itemName} already exists!`;

    if (duplicatedItems) {
      let duplicateItemsMessage = "";
      Object.entries(duplicatedItems).forEach(([key, value]) => {
        const capitalizedKey = Formatter.capitalizeAll(key);
        const fieldMessage = t
          ? t("Formatter.errors.duplicate.fieldUsed", {
              field: capitalizedKey,
              value,
            })
          : `${capitalizedKey} ${value} already used.`;
        duplicateItemsMessage += `\n${fieldMessage}`;
      });
      message = `${message}${duplicateItemsMessage}`;
    }

    return message;
  }
}
