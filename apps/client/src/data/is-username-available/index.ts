import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type IsUsernameAvailableResult = AxiosResponse<boolean>;
export type IsUsernameAvailableError = AxiosError<GenericResponseError>;

export const isUsernameAvailable = async (
  username: string
): Promise<IsUsernameAvailableResult> => {
  return axiosInstance.get<boolean>(
    `/users/is-username-available?username=${username}`
  );
};
