import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  changeWorkoutExercisesOrders,
  ChangeWorkoutExercisesOrdersError,
  ChangeWorkoutExercisesOrdersPayload,
  ChangeWorkoutExercisesOrdersResult,
} from "~/data/change-workout-exercises-orders";

export const useChangeWorkoutExercisesOrders = () => {
  const t = useTranslations("Hooks");
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
    onError: () => {
      return enqueueSnackbar(t("useChangeWorkoutExercisesOrders.error"), {
        variant: "error",
      });
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
