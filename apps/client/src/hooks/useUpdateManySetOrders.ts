import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  updateManySetOrders,
  UpdateManySetOrdersError,
  UpdateManySetOrdersPayload,
  UpdateManySetOrdersResult,
} from "~/data/update-many-set-orders";

export const useUpdateManySetOrders = () => {
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
      return enqueueSnackbar("Ops.. Error on update sets orders. Try again!", {
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
