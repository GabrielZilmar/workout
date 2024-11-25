import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import getProgressHistory, {
  GetProgressHistory,
} from "~/data/progress-history";

const useProgressHistory = (exerciseId: string) => {
  const { isPending, isLoading, error, data } = useQuery<
    GetProgressHistory,
    AxiosError
  >({
    queryKey: ["progress-history", exerciseId],
    queryFn: () => getProgressHistory(exerciseId),
    retry: 0,
    enabled: !!exerciseId,
  });

  return { isPending, isLoading, error, data: data?.data || null };
};

export default useProgressHistory;
