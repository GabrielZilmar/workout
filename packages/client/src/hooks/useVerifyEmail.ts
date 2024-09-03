import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import {
  VerifyEmailError,
  VerifyEmailPayload,
  VerifyEmailResult,
  verifyEmail,
} from "~/data/verify-email";

export const useVerifyEmail = () => {
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
      enqueueSnackbar("Your email has been successfully verified.", {
        variant: "success",
      });
    },
    onError: (error) => {
      let errorMessage =
        "Failed to verify email, try again later! Please contact a support";
      if (error.response?.data?.message?.includes("expired")) {
        errorMessage = "Email verification link expired!";
      }
      if (error.response?.data?.message?.includes("jwt string")) {
        errorMessage = "Invalid verify email token!";
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
