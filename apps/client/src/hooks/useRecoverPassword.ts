import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import {
  recoverPassword,
  RecoverPasswordError,
  RecoverPasswordPayload,
  RecoverPasswordResult,
} from "~/data/recover-password";

export const useRecoverPassword = () => {
  const t = useTranslations("Hooks");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: recoverPasswordMutation,
    isError,
    isSuccess,
    isPending,
    isIdle,
    error,
    data,
  } = useMutation<
    RecoverPasswordResult,
    RecoverPasswordError,
    RecoverPasswordPayload
  >({
    mutationFn: (payload) => recoverPassword(payload),
    onSuccess: () => {
      enqueueSnackbar(t("useRecoverPassword.success"), {
        variant: "success",
      });
    },
    onError: (error) => {
      let errorMessage = t("useRecoverPassword.errors.default");
      if (error.response?.data?.message?.includes("expired")) {
        errorMessage = t("useRecoverPassword.errors.expired");
      }
      if (error.response?.data?.message?.includes("jwt string")) {
        errorMessage = t("useRecoverPassword.errors.invalidToken");
      }

      setErrorMessage(errorMessage);
      return enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  return {
    recoverPasswordMutation,
    isError,
    isSuccess,
    isPending,
    isIdle,
    error: error?.response?.data,
    data,
    errorMessage,
  };
};

export default useRecoverPassword;
