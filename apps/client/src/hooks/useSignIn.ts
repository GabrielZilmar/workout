import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import signIn, { SignInPayload, SignInResult } from "~/data/sign-in";

import { HttpStatus } from "~/constants/httpStatus";
import { setCookie } from "cookies-next";
import Env from "~/shared/env";
import { COOKIES_NAMES } from "~/constants/cookies";
import { getRoutes } from "~/routes";
import { useLocale, useTranslations } from "next-intl";

export const useSignIn = () => {
  const t = useTranslations("Hooks");
  const locale = useLocale();
  const routes = getRoutes(locale);
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
      enqueueSnackbar(t("useSignIn.success"), { variant: "success" });
      router.push(routes.home);
    },
    onError: ({ response }: AxiosError) => {
      if (response?.status === HttpStatus.UNAUTHORIZED) {
        return enqueueSnackbar(t("useSignIn.errors.invalid"), {
          variant: "error",
        });
      }

      return enqueueSnackbar(t("useSignIn.errors.default"), {
        variant: "error",
      });
    },
  });

  return { signInMutation };
};

export default useSignIn;
