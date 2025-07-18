import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  deleteWorkoutExercise,
  DeleteWorkoutExerciseErrorResult,
  DeleteWorkoutExercisePayload,
  DeleteWorkoutExerciseResult,
} from "~/data/delete-workout-exercise";

export const useDeleteWorkoutExercise = () => {
  const t = useTranslations("Hooks");
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
      enqueueSnackbar(t("useDeleteWorkoutExercise.success"), {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(t("useDeleteWorkoutExercise.error"), {
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
