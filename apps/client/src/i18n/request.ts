import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { COOKIES_NAMES } from "~/constants/cookies";
import { LocaleTypes } from "~/i18n/locale";
import { routing } from "~/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  const defaultLocale =
    cookies().get(COOKIES_NAMES.LOCALE)?.value || routing.defaultLocale;

  if (!locale || !routing.locales.includes(locale as LocaleTypes)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
