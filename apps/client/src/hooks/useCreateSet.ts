import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  createSet,
  CreateSetErrorResult,
  CreateSetPayload,
  CreateSetResult,
} from "~/data/create-set";

export const useCreateSet = () => {
  const queryClient = useQueryClient();

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

      enqueueSnackbar("Set created!", { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar("Ops.. Error on create set. Try again!", {
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
