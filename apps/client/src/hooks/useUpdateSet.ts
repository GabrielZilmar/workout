import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  updateSet,
  UpdateSetErrorResult,
  UpdateSetPayload,
  UpdateSetResult,
} from "~/data/update-set";

export const useUpdateSet = () => {
  const t = useTranslations("Hooks");
  const queryClient = useQueryClient();

  const {
    mutate: updateSetMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<UpdateSetResult, UpdateSetErrorResult, UpdateSetPayload>({
    mutationFn: (payload) => updateSet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-infinite-sets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["progress-history"],
      });

      enqueueSnackbar(t("useUpdateSet.success"), { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar(t("useUpdateSet.error"), {
        variant: "error",
      });
    },
  });

  return {
    updateSetMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || null,
  };
};
