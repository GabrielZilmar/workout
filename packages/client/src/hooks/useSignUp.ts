import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import {
  signUp,
  SignUpPayload,
  SignUpResult,
  SignUpUserErrorResult,
} from "~/data/sign-up";
import Formatter from "~/shared/formatter";

export const useSignUp = () => {
  const { mutate: signUpMutation } = useMutation<
    SignUpResult,
    SignUpUserErrorResult,
    SignUpPayload
  >({
    mutationFn: (payload) => signUp(payload),
    onSuccess: ({ data }: SignUpResult) => {
      enqueueSnackbar("Successful sign up!", { variant: "success" });
    },
    onError: (error) => {
      if (error.response?.status === HttpStatus.CONFLICT) {
        let message = "Ops.. User already exists!";

        const { duplicatedItems } = error.response.data;
        if (duplicatedItems) {
          let duplicateItemsMessage = "";
          Object.entries(duplicatedItems).forEach(([key, value]) => {
            const capitalizedKey = Formatter.capitalizeAll(key);
            duplicateItemsMessage += `\n${capitalizedKey} ${value} already used.`;
          });
          message = `${message}${duplicateItemsMessage}`;
        }

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

  return { signUpMutation };
};
