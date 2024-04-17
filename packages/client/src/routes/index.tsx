import { RouteObject } from "react-router-dom";
import SignIn from "~/pages/signIn";

const Routes = [
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
      </div>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
] as RouteObject[];

export default Routes;
