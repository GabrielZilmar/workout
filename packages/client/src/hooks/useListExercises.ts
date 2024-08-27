import { useQuery } from "@tanstack/react-query";
import {
  listExercises,
  ListExercisesError,
  ListExercisesQuery,
  ListExercisesResponse,
  ListExercisesResult,
} from "~/data/list-exercises";

const initialData: ListExercisesResult = {
  items: [],
  count: 0,
};

export const useListExercises = (params: ListExercisesQuery = {}) => {
  const { isLoading, isError, error, data } = useQuery<
    ListExercisesResponse,
    ListExercisesError
  >({
    queryKey: ["exercises", params],
    queryFn: () => listExercises(params),
    retry: 0,
  });

  return { isLoading, isError, error, data: data?.data || initialData };
};
