import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type RecoverPasswordPayload = {
  token: string;
  newPassword: string;
};
export type RecoverPasswordResult = AxiosResponse<boolean>;
export type RecoverPasswordError = AxiosError<GenericResponseError>;

export const recoverPassword = async (
  payload: RecoverPasswordPayload
): Promise<RecoverPasswordResult> => {
  return axiosInstance.post<boolean>("/session/recover-password", {
    ...payload,
  });
};
