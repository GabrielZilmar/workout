import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import getUser, { GetUserResult } from "~/data/user/get-user";

export const useUser = () => {
  const { isPending, error, data } = useQuery<GetUserResult, AxiosError>({
    queryKey: ["sessionUserData"],
    queryFn: () => getUser(),
    retry: 0,
  });

  return { isPending, error, user: data?.data || null };
};

export default useUser;
