import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import signIn, { SignInPayload, SignInResult } from "~/data/signIn";

import { HttpStatus } from "~/constants/httpStatus";
import { setCookie } from "cookies-next";
import Env from "~/shared/env";
import { COOKIES_NAMES } from "~/constants/cookies";

export const useSignIn = () => {
  const router = useRouter();

  const { mutate: signInMutation } = useMutation<
    SignInResult,
    AxiosError,
    SignInPayload
  >({
    mutationFn: (payload) => signIn(payload),
    onSuccess: ({ data }: SignInResult) => {
      setCookie(COOKIES_NAMES.ACCESS_TOKEN, data.accessToken, {
        secure: true,
        sameSite: "lax",
        domain: Env.appDomain,
      });
      enqueueSnackbar("Successful login!", { variant: "success" });
      router.push("/");
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

export default useSignIn;
