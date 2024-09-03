import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import {
  SendVerifyEmailError,
  SendVerifyEmailPayload,
  SendVerifyEmailResult,
  sendVerifyEmail,
} from "~/data/send-verify-email";

export const useSendVerifyEmail = () => {
  const {
    mutate: sendVerifyEmailMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    SendVerifyEmailResult,
    SendVerifyEmailError,
    SendVerifyEmailPayload
  >({
    mutationFn: (payload) => sendVerifyEmail(payload),
    onSuccess: () => {
      enqueueSnackbar("Verify email has been sent!", {
        variant: "success",
      });
    },
    onError: ({ response }) => {
      if (response?.data?.message.includes("still valid")) {
        return enqueueSnackbar("Verify email already sent. Check your inbox!", {
          variant: "info",
        });
      }

      if (response?.data.statusCode === HttpStatus.CONFLICT) {
        return enqueueSnackbar("User email already verified!", {
          variant: "success",
        });
      }

      enqueueSnackbar("Ops.. Error on sending verify email. Try again!", {
        variant: "error",
      });
    },
  });

  return {
    sendVerifyEmailMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data,
  };
};

export default useSendVerifyEmail;
