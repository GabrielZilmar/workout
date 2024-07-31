import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@envi/ui/globals.css";
import QueryProviders from "~/lib/query-providers";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkoutApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
