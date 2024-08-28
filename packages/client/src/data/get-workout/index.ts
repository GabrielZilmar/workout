import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { Workout } from "~/types/workout";

export type GetWorkoutResult = AxiosResponse<Workout>;
export type GetWorkoutError = AxiosError<GenericResponseError>;

export const getWorkout = async (id: string): Promise<GetWorkoutResult> => {
  return axiosInstance.get<Workout>(`/workouts/${id}`);
};
