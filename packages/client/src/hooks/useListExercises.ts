import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  listExercises,
  ListExercisesError,
  ListExercisesQuery,
  ListExercisesResponse,
  ListExercisesResult,
} from "~/data/list-exercises";

const INITIAL_PAGE_PARAM = 0;
const TAKE_20_EXERCISES = 20;

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

export const useListPaginatedExercises = (query: ListExercisesQuery = {}) => {
  const {
    isPending,
    isLoading,
    isSuccess,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    data,
  } = useInfiniteQuery({
    queryKey: ["list-infinite-exercises", query],
    queryFn: ({ pageParam = 0 }) =>
      listExercises({ ...query, skip: pageParam, take: TAKE_20_EXERCISES }),
    initialPageParam: INITIAL_PAGE_PARAM,
    getNextPageParam: (lastPage, pages) => {
      const hasNextPage =
        lastPage.data.count >= pages.length * TAKE_20_EXERCISES;

      return hasNextPage ? pages.length * TAKE_20_EXERCISES : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data.items),
  });

  return {
    isPending,
    isLoading,
    isSuccess,
    isError,
    error: error as ListExercisesError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    data: data ?? [],
  };
};
