import { RouteObject } from "react-router-dom";
import SignIn from "~/pages/signIn";
import ProtectedRoute from "~/routes/protect-route";

const Routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div>
          <h1>Hello World</h1>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
] as RouteObject[];

export default Routes;
