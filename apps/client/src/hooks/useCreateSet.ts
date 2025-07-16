import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  createSet,
  CreateSetErrorResult,
  CreateSetPayload,
  CreateSetResult,
} from "~/data/create-set";

export const useCreateSet = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("Hooks");

  const {
    mutate: createSetMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<CreateSetResult, CreateSetErrorResult, CreateSetPayload>({
    mutationFn: (payload) => createSet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-infinite-sets"],
      });

      enqueueSnackbar(t("useCreateSet.success"), { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar(t("useCreateSet.error"), {
        variant: "error",
      });
    },
  });

  return {
    createSetMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || null,
  };
};
