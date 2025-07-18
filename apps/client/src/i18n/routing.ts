import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "~/i18n/locale";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});
