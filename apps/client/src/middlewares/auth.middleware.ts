import { NextURL } from "next/dist/server/web/next-url";
import { cookies } from "next/headers";
import { COOKIES_NAMES } from "~/constants/cookies";
import { HttpMethods } from "~/constants/http-methods";
import { HttpStatus } from "~/constants/httpStatus";
import { PUBLIC_ROUTES } from "~/routes";
import { WorkoutUser } from "~/types/user";

type AuthMiddlewareResponse = {
  isAuth: boolean;
  user?: WorkoutUser;
};

export async function authMiddleware(
  url: NextURL
): Promise<AuthMiddlewareResponse> {
  const { signIn: signInRoute, ...publicRoutes } = PUBLIC_ROUTES;
  if (Object.values(publicRoutes).includes(url.pathname)) {
    return { isAuth: true };
  }

  const accessToken = cookies().get(COOKIES_NAMES.ACCESS_TOKEN);
  if (!accessToken) {
    return { isAuth: false };
  }

  let response: Response;
  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/me`, {
      method: HttpMethods.GET,
      headers: {
        Authorization: accessToken.value,
      },
    });
  } catch (err) {
    return { isAuth: false };
  }

  if (response.status !== HttpStatus.OK) {
    return { isAuth: false };
  }

  const responseBody = (await response.json()) as WorkoutUser;
  return { isAuth: true, user: responseBody };
}
