import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  listSets,
  ListSetsError,
  ListSetsParams,
  ListSetsResponse,
  ListSetsResult,
} from "~/data/list-sets";

const INITIAL_PAGE_PARAM = 0;
const TAKE_20_SETS = 20;

const initialData: ListSetsResult = {
  items: [],
  count: 0,
};

export const useListSets = (params: ListSetsParams) => {
  const { isLoading, isError, error, data } = useQuery<
    ListSetsResponse,
    ListSetsError
  >({
    queryKey: ["sets", params],
    queryFn: () => listSets(params),
    retry: 0,
  });

  return { isLoading, isError, error, data: data?.data || initialData };
};

export const useListInfiniteSets = (params: ListSetsParams) => {
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
    queryKey: ["list-infinite-sets", params],
    queryFn: ({ pageParam = 0 }) =>
      listSets({ ...params, skip: pageParam, take: TAKE_20_SETS }),
    initialPageParam: INITIAL_PAGE_PARAM,
    getNextPageParam: (lastPage, pages) => {
      const hasNextPage = lastPage.data.count >= pages.length * TAKE_20_SETS;

      return hasNextPage ? pages.length * TAKE_20_SETS : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data.items),
  });

  return {
    isPending,
    isLoading,
    isSuccess,
    isError,
    error: error as ListSetsError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    data: data ?? [],
  };
};
