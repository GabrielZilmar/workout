import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  deleteWorkoutExercise,
  DeleteWorkoutExerciseErrorResult,
  DeleteWorkoutExercisePayload,
  DeleteWorkoutExerciseResult,
} from "~/data/delete-workout-exercise";

export const useDeleteWorkoutExercise = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteWorkoutExerciseMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    DeleteWorkoutExerciseResult,
    DeleteWorkoutExerciseErrorResult,
    DeleteWorkoutExercisePayload
  >({
    mutationFn: (payload) => deleteWorkoutExercise(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-exercises"],
      });
      enqueueSnackbar("Workout exercise deleted!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ops.. Error on delete workout exercise. Try again!", {
        variant: "error",
      });
    },
  });

  return {
    deleteWorkoutExerciseMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || false,
  };
};
