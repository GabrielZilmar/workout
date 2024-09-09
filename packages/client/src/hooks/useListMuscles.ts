import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  listMuscles,
  ListMusclesError,
  ListMusclesQuery,
  ListMusclesResponse,
  ListMusclesResult,
} from "~/data/list-muscles";

const INITIAL_PAGE_PARAM = 0;
const TAKE_20_MUSCLES = 20;

const initialData: ListMusclesResult = {
  items: [],
  count: 0,
};

export const useListMuscles = (params: ListMusclesQuery = {}) => {
  const { isLoading, isError, error, data } = useQuery<
    ListMusclesResponse,
    ListMusclesError
  >({
    queryKey: ["muscles", params],
    queryFn: () => listMuscles(params),
    retry: 0,
  });

  return { isLoading, isError, error, data: data?.data || initialData };
};

export const useListPaginatedMuscles = (query: ListMusclesQuery = {}) => {
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
    queryKey: ["list-infinite-muscles", query],
    queryFn: ({ pageParam = 0 }) =>
      listMuscles({ ...query, skip: pageParam, take: TAKE_20_MUSCLES }),
    initialPageParam: INITIAL_PAGE_PARAM,
    getNextPageParam: (lastPage, pages) => {
      const hasNextPage = lastPage.data.count >= pages.length * TAKE_20_MUSCLES;

      return hasNextPage ? pages.length * TAKE_20_MUSCLES : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data.items),
  });

  return {
    isPending,
    isLoading,
    isSuccess,
    isError,
    error: error as ListMusclesError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    data: data ?? [],
  };
};
