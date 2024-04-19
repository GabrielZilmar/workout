import { RouteObject } from "react-router-dom";
import Home from "~/pages/home";
import SignIn from "~/pages/signIn";
import ProtectedRoute from "~/routes/protect-route";

const homeRoutes = ["/", "/home"].map((path) => ({
  path: path,
  element: (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  ),
}));

const Routes = [
  ...homeRoutes,
  {
    path: "/sign-in",
    element: <SignIn />,
  },
] as RouteObject[];

export default Routes;
