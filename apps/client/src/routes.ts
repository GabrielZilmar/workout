import { getCookie } from "cookies-next";
import { COOKIES_NAMES } from "~/constants/cookies";
import { DEFAULT_LOCALE } from "~/i18n/locale";

type GoToRouteFunction = (id: string) => string;

type PublicRoute = {
  signIn: string;
  signUp: string;
  forgotPassword: string;
  recoverPassword: string;
  resetPassword: string;
  verifyEmail: string;
};

type PrivateRoute = {
  home: string;
  publicWorkouts: string;
  exercises: string;
  workoutDetails: GoToRouteFunction;
  userSettings: string;
  progress: string;
};

type AllRoutes = PublicRoute & PrivateRoute;

export const PUBLIC_ROUTES: PublicRoute = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  recoverPassword: "/recover-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
};

export const PRIVATE_ROUTES: PrivateRoute = {
  home: "/home",
  publicWorkouts: "/public-workouts",
  exercises: "/exercises",
  workoutDetails: (id: string) => `/workout/${id}`,
  userSettings: "/user/settings",
  progress: "/progress",
};

export const getRoutes = (locale?: string): AllRoutes => {
  if (!locale) {
    locale = getCookie(COOKIES_NAMES.LOCALE) || DEFAULT_LOCALE;
  }
  const prefix = `/${locale}`;
  return {
    signIn: `${prefix}/sign-in`,
    signUp: `${prefix}/sign-up`,
    forgotPassword: `${prefix}/forgot-password`,
    recoverPassword: `${prefix}/recover-password`,
    resetPassword: `${prefix}/reset-password`,
    verifyEmail: `${prefix}/verify-email`,
    home: `${prefix}/home`,
    publicWorkouts: `${prefix}/public-workouts`,
    exercises: `${prefix}/exercises`,
    workoutDetails: (id: string) => `${prefix}/workout/${id}`,
    userSettings: `${prefix}/user/settings`,
    progress: `${prefix}/progress`,
  };
};
