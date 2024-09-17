import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import {
  updateUser,
  UpdateUserErrorResult,
  UpdateUserPayload,
  UpdateUserResult,
} from "~/data/update-user";
import Formatter from "~/shared/formatter";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateUserMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<UpdateUserResult, UpdateUserErrorResult, UpdateUserPayload>({
    mutationFn: (payload) => updateUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessionUserData"],
      });

      enqueueSnackbar("User updated!", { variant: "success" });
    },
    onError: (error) => {
      let message = "Ops.. Error on update user. Try again!";
      let style: undefined | React.CSSProperties;

      if (error.response?.status === HttpStatus.CONFLICT) {
        message = Formatter.mountDuplicateErrorMessage({
          duplicatedItems: error.response.data.duplicatedItems,
          itemName: "User",
        });
        style = { whiteSpace: "pre-line" };
      }

      return enqueueSnackbar(message, { variant: "error", style });
    },
  });

  return {
    updateUserMutation,
    isError,
    isSuccess,
    error,
    data,
  };
};
