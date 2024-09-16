import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  deleteSet,
  DeleteSetErrorResult,
  DeleteSetPayload,
  DeleteSetResult,
} from "~/data/delete-set";

export const useDeleteSet = () => {
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

      enqueueSnackbar("Set deleted!", { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar("Ops.. Error on delete set. Try again!", {
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
