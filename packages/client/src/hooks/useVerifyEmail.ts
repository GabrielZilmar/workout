import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  VerifyEmailError,
  VerifyEmailPayload,
  VerifyEmailResult,
  verifyEmail,
} from "~/data/verify-email";

export const useVerifyEmail = () => {
  const {
    mutate: verifyEmailMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<VerifyEmailResult, VerifyEmailError, VerifyEmailPayload>({
    mutationFn: (payload) => verifyEmail(payload),
    onSuccess: () => {
      enqueueSnackbar("Your email has been successfully verified.", {
        variant: "success",
      });
    },
    onError: () => {
      if (error?.message.includes("expired")) {
        enqueueSnackbar("Email verification link expired!", {
          variant: "error",
        });
      }

      if (error?.message[0].includes("jwt string")) {
        enqueueSnackbar("Invalid verify email token!", { variant: "error" });
      }

      return enqueueSnackbar(
        "Failed to verify email, try again later! Please contact a support",
        { variant: "error" }
      );
    },
  });

  return {
    verifyEmailMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data,
  };
};

export default useVerifyEmail;
