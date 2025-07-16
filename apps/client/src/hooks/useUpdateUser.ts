import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Hooks");
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

      enqueueSnackbar(t("useUpdateUser.success"), { variant: "success" });
    },
    onError: (error) => {
      let message = t("useUpdateUser.error");
      let style: undefined | React.CSSProperties;

      if (error.response?.status === HttpStatus.CONFLICT) {
        message = Formatter.mountDuplicateErrorMessage({
          duplicatedItems: error.response.data.duplicatedItems,
          itemName: t("useUpdateUser.itemName"),
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
