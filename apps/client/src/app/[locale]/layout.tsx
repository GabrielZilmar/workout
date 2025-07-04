import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@workout/ui/globals.css";
import QueryProviders from "~/lib/query-providers";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "~/i18n/routing";

interface RootLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkoutApp",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <link rel="icon" href="/favicon.ico" />
      <body suppressHydrationWarning={true} className={nunito.className}>
        <NextIntlClientProvider messages={messages}>
          <QueryProviders>{children}</QueryProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
