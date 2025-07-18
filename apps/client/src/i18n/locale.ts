type LocaleItem = {
  label: string;
  value: LocaleTypes;
};
export const LOCALE_ITEMS: LocaleItem[] = [
  { label: "English", value: "en" },
  { label: "Português", value: "pt-br" },
  { label: "Español", value: "es" },
];
export const LOCALES = ["en", "pt-br", "es"] as const;
export type LocaleTypes = (typeof LOCALES)[number];
export const DEFAULT_LOCALE = "en";
