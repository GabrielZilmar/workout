"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { getCookie, setCookie } from "cookies-next";
import { COOKIES_NAMES } from "~/constants/cookies";
import { useLocale } from "next-intl";

export default function QueryProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const locale = useLocale();
  const cookieLocale = getCookie(COOKIES_NAMES.LOCALE);

  useEffect(() => {
    const pathnameMatchesCookie = locale === cookieLocale;
    if (!pathnameMatchesCookie) {
      setCookie(COOKIES_NAMES.LOCALE, locale);
    }
  }, [cookieLocale, locale]);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      preventDuplicate
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SnackbarProvider>
  );
}
