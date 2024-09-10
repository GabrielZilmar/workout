import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  sendRecoverPasswordEmail,
  SendRecoverPasswordEmailError,
  SendRecoverPasswordEmailPayload,
  SendRecoverPasswordEmailResult,
} from "~/data/send-recover-password-email";

export const useSendRecoverPasswordEmail = () => {
  const {
    mutate: sendRecoverPasswordEmailMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    SendRecoverPasswordEmailResult,
    SendRecoverPasswordEmailError,
    SendRecoverPasswordEmailPayload
  >({
    mutationFn: (payload) => sendRecoverPasswordEmail(payload),
    onSuccess: () => {
      enqueueSnackbar("Recover password email has been sent!", {
        variant: "success",
      });
    },
    onError: ({ response }) => {
      if (response?.data?.message.includes("still valid")) {
        return enqueueSnackbar(
          "Recover password email already sent. Check your inbox!",
          { variant: "info" }
        );
      }

      enqueueSnackbar(
        "Ops.. Error on sending recover password email. Try again!",
        {
          variant: "error",
        }
      );
    },
  });

  return {
    sendRecoverPasswordEmailMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data,
  };
};

export default useSendRecoverPasswordEmail;
