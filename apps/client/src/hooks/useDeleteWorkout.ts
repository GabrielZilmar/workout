import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  deleteWorkout,
  DeleteWorkoutErrorResult,
  DeleteWorkoutPayload,
  DeleteWorkoutResult,
} from "~/data/delete-workout";

export const useDeleteWorkout = () => {
  const t = useTranslations("Hooks");
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
      enqueueSnackbar(t("useDeleteWorkout.success"), { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar(t("useDeleteWorkout.error"), {
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
