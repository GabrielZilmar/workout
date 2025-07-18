import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  updateManySetOrders,
  UpdateManySetOrdersError,
  UpdateManySetOrdersPayload,
  UpdateManySetOrdersResult,
} from "~/data/update-many-set-orders";

export const useUpdateManySetOrders = () => {
  const t = useTranslations("Hooks");
  const queryClient = useQueryClient();

  const {
    mutate: updateManySetOrdersMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    UpdateManySetOrdersResult,
    UpdateManySetOrdersError,
    UpdateManySetOrdersPayload
  >({
    mutationFn: (payload) => updateManySetOrders(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sets"],
      });
    },
    onError: () => {
      return enqueueSnackbar(t("useUpdateManySetOrders.error"), {
        variant: "error",
      });
    },
  });

  return {
    updateManySetOrdersMutation,
    isError,
    isSuccess,
    error,
    data,
  };
};
