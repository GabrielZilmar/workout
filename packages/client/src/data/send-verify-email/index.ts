import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type SendVerifyEmailPayload = {
  userId: string;
};

export type SendVerifyEmailResult = AxiosResponse<boolean>;
export type SendVerifyEmailError = AxiosError<GenericResponseError>;

export const sendVerifyEmail = async ({
  userId,
}: SendVerifyEmailPayload): Promise<SendVerifyEmailResult> => {
  const response = await axiosInstance.post<boolean>(
    `/session/send-verify-email`,
    { userId }
  );

  return response;
};
