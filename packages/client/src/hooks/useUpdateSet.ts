import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  updateSet,
  UpdateSetErrorResult,
  UpdateSetPayload,
  UpdateSetResult,
} from "~/data/update-set";

export const useUpdateSet = () => {
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

      enqueueSnackbar("Set updated!", { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar("Ops.. Error on update set. Try again!", {
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
