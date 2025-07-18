import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import { sendVerifyEmail } from "~/data/send-verify-email";
import {
  signUp,
  SignUpPayload,
  SignUpResult,
  SignUpUserErrorResult,
} from "~/data/sign-up";
import Formatter from "~/shared/formatter";

export const useSignUp = () => {
  const t = useTranslations("Hooks");

  const {
    mutate: signUpMutation,
    data,
    isError,
    isSuccess,
  } = useMutation<SignUpResult, SignUpUserErrorResult, SignUpPayload>({
    mutationFn: (payload) => signUp(payload),
    onSuccess: ({ data }: SignUpResult) => {
      enqueueSnackbar(t("useSignUp.success"), { variant: "success" });
      try {
        sendVerifyEmail({ userId: data.id });
      } catch (err) {
        return enqueueSnackbar(t("useSignUp.errors.sendVerifyEmail"), {
          variant: "error",
          style: { whiteSpace: "pre-line" },
        });
      }
    },
    onError: (error) => {
      if (error.response?.status === HttpStatus.CONFLICT) {
        const message = Formatter.mountDuplicateErrorMessage({
          duplicatedItems: error.response.data.duplicatedItems,
          itemName: t("useSignUp.itemName"),
        });

        return enqueueSnackbar(message, {
          variant: "error",
          style: { whiteSpace: "pre-line" },
        });
      }

      return enqueueSnackbar(t("useSignUp.errors.default"), {
        variant: "error",
      });
    },
  });

  return { signUpMutation, data: data?.data || null, isError, isSuccess };
};
