import { enqueueSnackbar } from "notistack";
import { Navigate } from "react-router-dom";
import { useUser } from "~/hooks";

type ProtectedRouteParams = React.FC<{ children: React.ReactNode }>;

const ProtectedRoute: ProtectedRouteParams = ({ children }) => {
  const { isPending, error, data } = useUser();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    enqueueSnackbar("Ops.. Session ended. Sign in again!", {
      variant: "error",
    });
    return <Navigate to={"/sign-in"} replace />;
  }

  return children;
};

export default ProtectedRoute;
