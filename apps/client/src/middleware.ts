import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { authMiddleware } from "~/middlewares";
import { getRoutes } from "~/routes";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { DEFAULT_LOCALE } from "~/i18n/locale";
import { COOKIES_NAMES } from "~/constants/cookies";

export default createMiddleware(routing);

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const url = req.nextUrl.clone();
  const locale = req.cookies.get(COOKIES_NAMES.LOCALE)?.value || DEFAULT_LOCALE;
  const routes = getRoutes(locale);
  const { isAuth } = await authMiddleware({ url, locale });

  const isSignInPage = url.pathname === routes.signIn;
  if (!isAuth && !isSignInPage) {
    url.pathname = routes.signIn;
    return NextResponse.redirect(url);
  }
  if (isAuth && isSignInPage) {
    url.pathname = `/${locale}/home`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|public).*)"],
};
