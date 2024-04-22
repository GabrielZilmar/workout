import { AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { WorkoutUser } from "~/types/user";

export type RegisterUserPayload = {
  username: string;
  email: string;
  password: string;
};

export type RegisterUserResult = AxiosResponse<WorkoutUser, AxiosResponse>;

export const registerUser = async (
  payload: RegisterUserPayload
): Promise<RegisterUserResult> => {
  const response = await axiosInstance.post<WorkoutUser>("/users", {
    ...payload,
  });

  return response;
};
