import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  deleteWorkout,
  DeleteWorkoutErrorResult,
  DeleteWorkoutPayload,
  DeleteWorkoutResult,
} from "~/data/delete-workout";

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteWorkoutMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    DeleteWorkoutResult,
    DeleteWorkoutErrorResult,
    DeleteWorkoutPayload
  >({
    mutationFn: (payload) => deleteWorkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["public-workouts"],
      });
      enqueueSnackbar("Workout deleted!", { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar("Ops.. Error on delete workout. Try again!", {
        variant: "error",
      });
    },
  });

  return {
    deleteWorkoutMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || false,
  };
};

export default useDeleteWorkout;
