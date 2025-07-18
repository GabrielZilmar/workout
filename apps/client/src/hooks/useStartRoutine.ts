import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import {
  startRoutine,
  StartRoutineError,
  StartRoutinePayload,
  StartRoutineResult,
} from "~/data/start-routine";

export const useStartRoutine = () => {
  const t = useTranslations("Hooks");
  const queryClient = useQueryClient();

  const {
    mutate: startRoutineMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<StartRoutineResult, StartRoutineError, StartRoutinePayload>({
    mutationFn: (payload) => startRoutine(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["public-workouts"],
      });

      enqueueSnackbar(t("useStartRoutine.success"), { variant: "success" });
    },
    onError: (data) => {
      if (data.response?.status === HttpStatus.FORBIDDEN) {
        return enqueueSnackbar(t("useStartRoutine.errors.forbidden"), {
          variant: "error",
        });
      }

      enqueueSnackbar(t("useStartRoutine.errors.default"), {
        variant: "error",
      });
    },
  });

  return { startRoutineMutation, isError, isSuccess, error, data };
};
