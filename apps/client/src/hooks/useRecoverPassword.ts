import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import {
  recoverPassword,
  RecoverPasswordError,
  RecoverPasswordPayload,
  RecoverPasswordResult,
} from "~/data/recover-password";

export const useRecoverPassword = () => {
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
      enqueueSnackbar("Password recovered.", {
        variant: "success",
      });
    },
    onError: (error) => {
      let errorMessage =
        "Failed to recover password, try again later! Please contact a support";
      if (error.response?.data?.message?.includes("expired")) {
        errorMessage = "Recover password link expired!";
      }
      if (error.response?.data?.message?.includes("jwt string")) {
        errorMessage = "Invalid recover password token!";
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
