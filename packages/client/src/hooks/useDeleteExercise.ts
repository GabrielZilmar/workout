import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  deleteExercise,
  DeleteExerciseErrorResult,
  DeleteExercisePayload,
  DeleteExerciseResult,
} from "~/data/delete-exercise";

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteDeleteMutation,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<
    DeleteExerciseResult,
    DeleteExerciseErrorResult,
    DeleteExercisePayload
  >({
    mutationFn: (payload) => deleteExercise(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercises"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-infinite-exercises"],
      });

      enqueueSnackbar("Exercise deleted!", { variant: "success" });
    },
    onError: () => {
      return enqueueSnackbar("Ops.. Error on delete exercise. Try again!", {
        variant: "error",
      });
    },
  });

  return {
    deleteDeleteMutation,
    isError,
    isSuccess,
    error: error?.response?.data,
    data: data?.data || false,
  };
};

export default useDeleteExercise;
