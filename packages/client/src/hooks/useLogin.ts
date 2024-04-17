import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import signIn, { SignInPayload, SignInResult } from "~/data/signIn";
import SessionStorage, { SESSION_ITEMS } from "~/shared/storage/session";
import { HttpStatus } from "~/constants/httpStatus";

export const useLogin = () => {
  const navigate = useNavigate();

  const { mutate: signInMutation } = useMutation<
    SignInResult,
    AxiosError,
    SignInPayload
  >({
    mutationFn: (payload) => signIn(payload),
    onSuccess: ({ data }: SignInResult) => {
      SessionStorage.setItem({
        key: SESSION_ITEMS.accessToken,
        value: data.accessToken,
      });
      navigate("/");
    },
    onError: ({ response }: AxiosError) => {
      if (response?.status === HttpStatus.UNAUTHORIZED) {
        return enqueueSnackbar("Ops.. Invalid password or email. Try again!", {
          variant: "error",
        });
      }

      return enqueueSnackbar("Ops.. Error on sign in. Try again!", {
        variant: "error",
      });
    },
  });

  return { signInMutation };
};

export default useLogin;
