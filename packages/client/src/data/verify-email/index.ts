import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type VerifyEmailPayload = {
  token: string;
};

export type VerifyEmailResult = AxiosResponse<boolean>;
export type VerifyEmailError = AxiosError<GenericResponseError>;

export const verifyEmail = async (
  payload: VerifyEmailPayload
): Promise<VerifyEmailResult> => {
  const response = await axiosInstance.post<boolean>(`/session/verify-email`, {
    ...payload,
  });

  return response;
};
