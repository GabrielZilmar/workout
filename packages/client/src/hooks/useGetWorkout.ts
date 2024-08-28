import { useQuery } from "@tanstack/react-query";
import {
  getWorkout,
  GetWorkoutError,
  GetWorkoutResult,
} from "~/data/get-workout";

export const useGetWorkout = (id: string) => {
  const { isLoading, isError, error, data } = useQuery<
    GetWorkoutResult,
    GetWorkoutError
  >({
    queryKey: ["workouts", id],
    queryFn: () => getWorkout(id),
    enabled: !!id,
  });

  return { isLoading, isError, error, data: data?.data || null };
};
