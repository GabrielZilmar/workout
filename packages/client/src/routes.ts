type PublicRouteNames =
  | "signIn"
  | "signUp"
  | "forgotPassword"
  | "resetPassword"
  | "verifyEmail";
type PublicRoute = { [key in PublicRouteNames]: string };

type PrivateRouteNames = "home" | "publicWorkouts" | "exercises";
type PrivateRoute = { [key in PrivateRouteNames]: string };

type AllRoutes = PublicRoute & PrivateRoute;

export const PUBLIC_ROUTES: PublicRoute = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
};

export const PRIVATE_ROUTES: PrivateRoute = {
  home: "/home",
  publicWorkouts: "/public-workouts",
  exercises: "/exercises",
};

export const ALL_ROUTES: AllRoutes = {
  ...PUBLIC_ROUTES,
  ...PRIVATE_ROUTES,
};
