export type Languages = "PORTUGUESE" | "SPANISH";
export const LANGUAGES_ARRAY = [
  "PORTUGUESE" as Languages,
  "SPANISH" as Languages,
] as const;
export const LOCALE_MAP = {
  PORTUGUESE: "pt-br",
  SPANISH: "es",
};
