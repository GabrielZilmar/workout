import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  deleteSet,
  DeleteSetErrorResult,
  DeleteSetPayload,
  DeleteSetResult,
} from "~/data/delete-set";

export const useDeleteSet = () => {
  const t = useTranslations("Hooks");
  const queryClient = useQueryClient();

  const {
    mutate: deleteSetMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<DeleteSetResult, DeleteSetErrorResult, DeleteSetPayload>({
    mutationFn: (payload) => deleteSet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-infinite-sets"],
      });

      enqueueSnackbar(t("useDeleteSet.success"), { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar(t("useDeleteSet.error"), {
        variant: "error",
      });
    },
  });

  return {
    deleteSetMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || false,
  };
};

export default useDeleteSet;
