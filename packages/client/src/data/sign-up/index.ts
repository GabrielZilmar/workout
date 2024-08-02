import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { WorkoutUser } from "~/types/user";

type SignInApiResponse = WorkoutUser;

export type SignInPayload = {
  username: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
};

export type SignInResult = AxiosResponse<SignInApiResponse, AxiosError>;

export const signUp = async (payload: SignInPayload): Promise<SignInResult> => {
  const response = await axiosInstance.post<SignInApiResponse>("/users", {
    ...payload,
  });

  return response;
};
