import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { authMiddleware } from "~/middlewares";
import { ALL_ROUTES } from "~/routes";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const url = req.nextUrl.clone();
  const { isAuth } = await authMiddleware(url);

  const isSignInPage = url.pathname === ALL_ROUTES.signIn;
  if (!isAuth && !isSignInPage) {
    url.pathname = ALL_ROUTES.signIn;
    return NextResponse.redirect(url);
  }
  if (isAuth && isSignInPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|public).*)"],
};
