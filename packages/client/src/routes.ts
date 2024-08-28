type GoToRouteFunction = (id: string) => string;

type PublicRoute = {
  signIn: string;
  signUp: string;
  forgotPassword: string;
  resetPassword: string;
  verifyEmail: string;
};

type PrivateRoute = {
  home: string;
  publicWorkouts: string;
  exercises: string;
  workoutDetails: GoToRouteFunction;
};

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
  workoutDetails: (id: string) => `/workout/${id}`,
};

export const ALL_ROUTES: AllRoutes = {
  ...PUBLIC_ROUTES,
  ...PRIVATE_ROUTES,
};
