import { useQuery } from "@tanstack/react-query";
import {
  ListPublicWorkoutResult,
  ListPublicWorkoutsError,
  ListPublicWorkoutsQuery,
  ListPublicWorkoutsResponse,
  listPublicWorkouts,
} from "~/data/list-public-workouts";

const initialData: ListPublicWorkoutResult = {
  items: [],
  count: 0,
};

export const useListPublicWorkouts = (params: ListPublicWorkoutsQuery = {}) => {
  const { isLoading, isError, error, data } = useQuery<
    ListPublicWorkoutsResponse,
    ListPublicWorkoutsError
  >({
    queryKey: ["public-workouts", params],
    queryFn: () => listPublicWorkouts(params),
    retry: 0,
  });

  return { isLoading, isError, error, data: data?.data || initialData };
};
