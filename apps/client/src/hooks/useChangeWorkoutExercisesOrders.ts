import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  changeWorkoutExercisesOrders,
  ChangeWorkoutExercisesOrdersError,
  ChangeWorkoutExercisesOrdersPayload,
  ChangeWorkoutExercisesOrdersResult,
} from "~/data/change-workout-exercises-orders";

export const useChangeWorkoutExercisesOrders = () => {
  const queryClient = useQueryClient();

  const {
    mutate: changeWorkoutExercisesOrdersMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    ChangeWorkoutExercisesOrdersResult,
    ChangeWorkoutExercisesOrdersError,
    ChangeWorkoutExercisesOrdersPayload
  >({
    mutationFn: (payload) => changeWorkoutExercisesOrders(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-exercises"],
      });
    },
    onError: (error) => {
      return enqueueSnackbar(
        "Ops.. Error on update workout exercises orders. Try again!",
        { variant: "error" }
      );
    },
  });

  return {
    changeWorkoutExercisesOrdersMutation,
    isError,
    isSuccess,
    error,
    data,
  };
};
