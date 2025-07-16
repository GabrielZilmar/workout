import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import {
  VerifyEmailError,
  VerifyEmailPayload,
  VerifyEmailResult,
  verifyEmail,
} from "~/data/verify-email";

export const useVerifyEmail = () => {
  const t = useTranslations("Hooks");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: verifyEmailMutation,
    isError,
    isSuccess,
    isPending,
    isIdle,
    error,
    data,
  } = useMutation<VerifyEmailResult, VerifyEmailError, VerifyEmailPayload>({
    mutationFn: (payload) => verifyEmail(payload),
    onSuccess: () => {
      enqueueSnackbar(t("useVerifyEmail.success"), {
        variant: "success",
      });
    },
    onError: (error) => {
      let errorMessage = t("useVerifyEmail.errors.default");
      if (error.response?.data?.message?.includes("expired")) {
        errorMessage = t("useVerifyEmail.errors.expired");
      }
      if (error.response?.data?.message?.includes("jwt string")) {
        errorMessage = t("useVerifyEmail.errors.invalid");
      }

      setErrorMessage(errorMessage);
      return enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  return {
    verifyEmailMutation,
    isError,
    isSuccess,
    isPending,
    isIdle,
    error: error?.response?.data,
    data,
    errorMessage,
  };
};

export default useVerifyEmail;
