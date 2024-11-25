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

export const ALL_ROUTES: AllRoutes = {
  ...PUBLIC_ROUTES,
  ...PRIVATE_ROUTES,
};
