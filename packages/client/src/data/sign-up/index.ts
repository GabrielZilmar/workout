import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { WorkoutUser } from "~/types/user";

type SignUpApiResponse = WorkoutUser;

export type SignUpPayload = {
  username: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
};

type SignUpUserError = {
  duplicatedItems?: Record<string, string>;
  message: string;
};
export type SignUpUserErrorResult = AxiosError<SignUpUserError>;

export type SignUpResult = AxiosResponse<SignUpApiResponse, AxiosError>;

export const signUp = async (payload: SignUpPayload): Promise<SignUpResult> => {
  const response = await axiosInstance.post<SignUpApiResponse>("/users", {
    ...payload,
  });

  return response;
};
