import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type UpdateUserPayload = {
  id: string;
  username?: string;
  age?: number;
  weight?: number;
  height?: number;
};

type UpdateUserError = GenericResponseError & {
  duplicatedItems?: Record<string, string>;
};
export type UpdateUserErrorResult = AxiosError<UpdateUserError>;

export type UpdateUserResult = AxiosResponse<boolean>;

export const updateUser = async ({
  id,
  ...payload
}: UpdateUserPayload): Promise<UpdateUserResult> => {
  return axiosInstance.patch<boolean>(`/users/${id}`, {
    ...payload,
  });
};
