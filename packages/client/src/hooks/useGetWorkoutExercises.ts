import { useQuery } from "@tanstack/react-query";
import {
  getWorkoutExercise,
  GetWorkoutExerciseError,
  GetWorkoutExerciseParams,
  GetWorkoutExerciseResponse,
} from "~/data/get-workout-exercise";
import { WorkoutExercise } from "~/types/workout-exercise";

const initialData = {
  items: [] as WorkoutExercise[],
  count: 0,
};

export const useGetWorkoutExercises = (params: GetWorkoutExerciseParams) => {
  const { isLoading, isError, error, data } = useQuery<
    GetWorkoutExerciseResponse,
    GetWorkoutExerciseError
  >({
    queryKey: ["workout-exercises", params.workoutId],
    queryFn: () => getWorkoutExercise(params),
    enabled: !!params.workoutId,
  });

  return { isLoading, isError, error, data: data?.data || initialData };
};
