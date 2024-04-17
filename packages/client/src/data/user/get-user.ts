import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "~/data/api";
import { WorkoutUser } from "~/types/user";

export type GetUserResult = AxiosResponse<WorkoutUser, AxiosError>;

export const getUser = async (): Promise<GetUserResult> => {
  const response = await axiosInstance.get<WorkoutUser>("/users/me");

  return response;
};

export default getUser;
