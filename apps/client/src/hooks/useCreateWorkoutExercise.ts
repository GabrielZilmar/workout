import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import {
  createWorkoutExercise,
  CreateWorkoutExerciseErrorResult,
  CreateWorkoutExercisePayload,
  CreateWorkoutExerciseResult,
} from "~/data/create-workout-exercise";

export const useCreateWorkoutExercise = () => {
  const t = useTranslations("Hooks");
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

      enqueueSnackbar(t("useCreateWorkoutExercise.success"), {
        variant: "success",
      });
    },
    onError: () => {
      return enqueueSnackbar(t("useCreateWorkoutExercise.error"), {
        variant: "error",
      });
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
