import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type SendRecoverPasswordEmailPayload = {
  userId: string;
};

export type SendRecoverPasswordEmailResult = AxiosResponse<boolean>;
export type SendRecoverPasswordEmailError = AxiosError<GenericResponseError>;

export const sendRecoverPasswordEmail = async ({
  userId,
}: SendRecoverPasswordEmailPayload): Promise<SendRecoverPasswordEmailResult> => {
  return axiosInstance.post<boolean>(`/session/send-recover-password-email`, {
    userId,
  });
};