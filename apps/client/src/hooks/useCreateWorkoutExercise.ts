import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  createWorkoutExercise,
  CreateWorkoutExerciseErrorResult,
  CreateWorkoutExercisePayload,
  CreateWorkoutExerciseResult,
} from "~/data/create-workout-exercise";

export const useCreateWorkoutExercise = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createWorkoutExerciseMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    CreateWorkoutExerciseResult,
    CreateWorkoutExerciseErrorResult,
    CreateWorkoutExercisePayload
  >({
    mutationFn: (payload) => createWorkoutExercise(payload),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["workout-exercises", data.workoutId],
      });

      enqueueSnackbar("Workout exercise created!", { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar(
        "Ops.. Error on create workout exercise. Try again!",
        { variant: "error" }
      );
    },
  });

  return {
    createWorkoutExerciseMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || null,
  };
};
