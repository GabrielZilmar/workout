import { useMutation } from "@tanstack/react-query";
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
  const {
    mutate: signUpMutation,
    data,
    isError,
    isSuccess,
  } = useMutation<SignUpResult, SignUpUserErrorResult, SignUpPayload>({
    mutationFn: (payload) => signUp(payload),
    onSuccess: ({ data }: SignUpResult) => {
      enqueueSnackbar("Successful sign up!", { variant: "success" });
      try {
        sendVerifyEmail({ userId: data.id });
      } catch (err) {
        return enqueueSnackbar(
          "Something went wrong when sending the verification email. Try again later.",
          {
            variant: "error",
            style: { whiteSpace: "pre-line" },
          }
        );
      }
    },
    onError: (error) => {
      if (error.response?.status === HttpStatus.CONFLICT) {
        const message = Formatter.mountDuplicateErrorMessage({
          duplicatedItems: error.response.data.duplicatedItems,
          itemName: "User",
        });

        return enqueueSnackbar(message, {
          variant: "error",
          style: { whiteSpace: "pre-line" },
        });
      }

      return enqueueSnackbar("Ops.. Error on register user. Try again!", {
        variant: "error",
      });
    },
  });

  return { signUpMutation, data: data?.data || null, isError, isSuccess };
};
