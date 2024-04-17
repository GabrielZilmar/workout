import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "~/data/api";

type SignInApiResponse = {
  accessToken: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResult = AxiosResponse<SignInApiResponse, AxiosError>;

export const signIn = async (payload: SignInPayload): Promise<SignInResult> => {
  const response = await axiosInstance.post<SignInApiResponse>(
    "/session/login",
    {
      ...payload,
    }
  );

  return response;
};

export default signIn;
