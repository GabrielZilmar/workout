import { useQuery } from "@tanstack/react-query";
import {
  ListWorkoutResult,
  listWorkouts,
  ListWorkoutsError,
  ListWorkoutsQuery,
  ListWorkoutsResult,
} from "~/data/list-workouts";

const initialData: ListWorkoutResult = {
  items: [],
  count: 0,
};

export const useListWorkouts = (params: ListWorkoutsQuery = {}) => {
  const { isLoading, error, data } = useQuery<
    ListWorkoutsResult,
    ListWorkoutsError
  >({
    queryKey: ["workouts", params],
    queryFn: () => listWorkouts(params),
    retry: 0,
  });

  return { isLoading, error, data: data?.data || initialData };
};
