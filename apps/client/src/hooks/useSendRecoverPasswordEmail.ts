import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  sendRecoverPasswordEmail,
  SendRecoverPasswordEmailError,
  SendRecoverPasswordEmailPayload,
  SendRecoverPasswordEmailResult,
} from "~/data/send-recover-password-email";

export const useSendRecoverPasswordEmail = () => {
  const t = useTranslations("Hooks");

  const {
    mutate: sendRecoverPasswordEmailMutation,
    isError,
    isSuccess,
    isPending,
    isIdle,
    error,
    data,
  } = useMutation<
    SendRecoverPasswordEmailResult,
    SendRecoverPasswordEmailError,
    SendRecoverPasswordEmailPayload
  >({
    mutationFn: (payload) => sendRecoverPasswordEmail(payload),
    onSuccess: () => {
      enqueueSnackbar(t("useSendRecoverPasswordEmail.success"), {
        variant: "success",
      });
    },
    onError: ({ response }) => {
      if (response?.data?.message.includes("still valid")) {
        return enqueueSnackbar(
          t("useSendRecoverPasswordEmail.errors.alreadySent"),
          { variant: "info" }
        );
      }

      enqueueSnackbar(t("useSendRecoverPasswordEmail.errors.default"), {
        variant: "error",
      });
    },
  });

  return {
    sendRecoverPasswordEmailMutation,
    isError,
    isSuccess,
    isPending,
    isIdle,
    error: error?.response?.data,
    data,
  };
};

export default useSendRecoverPasswordEmail;
