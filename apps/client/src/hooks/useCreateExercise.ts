import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  createExercise,
  CreateExerciseErrorResult,
  CreateExercisePayload,
  CreateExerciseResult,
} from "~/data/create-exercise";

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createExerciseMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    CreateExerciseResult,
    CreateExerciseErrorResult,
    CreateExercisePayload
  >({
    mutationFn: (payload) => createExercise(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercises"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-infinite-exercises"],
      });
    },
    onError: () => {
      return enqueueSnackbar("Ops.. Error creating exercise. Try again!", {
        variant: "error",
      });
    },
  });

  return {
    createExerciseMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || null,
  };
};
