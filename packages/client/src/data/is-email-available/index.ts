import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type IsEmailAvailableResult = AxiosResponse<boolean>;
export type IsEmailAvailableError = AxiosError<GenericResponseError>;

export const isEmailAvailable = async (
  email: string
): Promise<IsEmailAvailableResult> => {
  return axiosInstance.get<boolean>(`/users/is-email-available?email=${email}`);
};
