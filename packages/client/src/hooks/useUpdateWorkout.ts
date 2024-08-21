import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      enqueueSnackbar("Workout updated!", { variant: "success" });
    },
    onError: (error) => {
      if (error.response?.status === HttpStatus.CONFLICT) {
        const message = Formatter.mountDuplicateErrorMessage({
          duplicatedItems: error.response.data.duplicatedItems,
          itemName: "Workout",
        });

        return enqueueSnackbar(message, {
          variant: "error",
          style: { whiteSpace: "pre-line" },
        });
      }

      return enqueueSnackbar("Ops.. Error on update workout. Try again!", {
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
