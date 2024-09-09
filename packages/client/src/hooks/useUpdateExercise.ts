import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  updateExercise,
  UpdateExerciseErrorResult,
  UpdateExercisePayload,
  UpdateExerciseResult,
} from "~/data/update-exercise";

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateExerciseMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    UpdateExerciseResult,
    UpdateExerciseErrorResult,
    UpdateExercisePayload
  >({
    mutationFn: (payload) => updateExercise(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercises"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-infinite-exercises"],
      });
    },
    onError: () => {
      return enqueueSnackbar("Ops.. Error updating exercise. Try again!", {
        variant: "error",
      });
    },
  });

  return {
    updateExerciseMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || null,
  };
};
