import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import {
  createWorkout,
  CreateWorkoutErrorResult,
  CreateWorkoutPayload,
  CreateWorkoutResult,
} from "~/data/create-workout";
import Formatter from "~/shared/formatter";

export const useCreateWorkout = () => {
  const t = useTranslations("Hooks");
  const queryClient = useQueryClient();

  const {
    mutate: createWorkoutMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    CreateWorkoutResult,
    CreateWorkoutErrorResult,
    CreateWorkoutPayload
  >({
    mutationFn: (payload) => createWorkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
      enqueueSnackbar(t("useCreateWorkout.success"), { variant: "success" });
    },
    onError: (error) => {
      if (error.response?.status === HttpStatus.CONFLICT) {
        const message = Formatter.mountDuplicateErrorMessage({
          duplicatedItems: error.response.data.duplicatedItems,
          itemName: t("useCreateWorkout.itemName"),
          t,
        });

        return enqueueSnackbar(message, {
          variant: "error",
          style: { whiteSpace: "pre-line" },
        });
      }

      return enqueueSnackbar(t("useCreateWorkout.error"), {
        variant: "error",
      });
    },
  });

  return {
    createWorkoutMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || null,
  };
};

export default useCreateWorkout;
