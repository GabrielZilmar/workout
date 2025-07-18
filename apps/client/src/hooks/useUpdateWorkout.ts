import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import {
  updateWorkout,
  UpdateWorkoutErrorResult,
  UpdateWorkoutPayload,
  UpdateWorkoutResult,
} from "~/data/update-workout";
import Formatter from "~/shared/formatter";

export const useUpdateWorkout = () => {
  const t = useTranslations("Hooks");
  const queryClient = useQueryClient();

  const {
    mutate: updateWorkoutMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    UpdateWorkoutResult,
    UpdateWorkoutErrorResult,
    UpdateWorkoutPayload
  >({
    mutationFn: (payload) => updateWorkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
      enqueueSnackbar(t("useUpdateWorkout.success"), { variant: "success" });
    },
    onError: (error) => {
      if (error.response?.status === HttpStatus.CONFLICT) {
        const message = Formatter.mountDuplicateErrorMessage({
          duplicatedItems: error.response.data.duplicatedItems,
          itemName: t("useUpdateWorkout.itemName"),
          t,
        });

        return enqueueSnackbar(message, {
          variant: "error",
          style: { whiteSpace: "pre-line" },
        });
      }

      return enqueueSnackbar(t("useUpdateWorkout.error"), {
        variant: "error",
      });
    },
  });

  return {
    updateWorkoutMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || null,
  };
};

export default useUpdateWorkout;
