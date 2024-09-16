import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "~/constants/httpStatus";
import {
  startRoutine,
  StartRoutineError,
  StartRoutinePayload,
  StartRoutineResult,
} from "~/data/start-routine";

export const useStartRoutine = () => {
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

      enqueueSnackbar("Routine started!", { variant: "success" });
    },
    onError: (data) => {
      if (data.response?.status === HttpStatus.FORBIDDEN) {
        return enqueueSnackbar(
          "You can't start a routine from a private workout that doesn't belongs to you",
          {
            variant: "error",
          }
        );
      }

      enqueueSnackbar("Ops.. Error on start routine. Try again!", {
        variant: "error",
      });
    },
  });

  return { startRoutineMutation, isError, isSuccess, error, data };
};
