import { DefaultError, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import signIn, { SignInPayload } from "~/data/signIn";
import { WorkoutUser } from "~/types/user";

export const useLogin = () => {
  const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();

  const { mutate: signInMutation } = useMutation<
    WorkoutUser,
    DefaultError,
    SignInPayload
  >({
    mutationFn: (payload) => signIn(payload),
    onSuccess: (data: WorkoutUser) => {
      console.log("data", data);
      // TODO: save the user in the state
      navigate("/home");
    },
    onError: (error: Error) => {
      console.log("🚀 ~ useLogin ~ error:", error);
      // enqueueSnackbar('Ops.. Error on sign in. Try again!', {
      //   variant: 'error'
      // });
      alert(`Ops, error ${error}`);
    },
  });

  return { signInMutation };
};

export default useLogin;
