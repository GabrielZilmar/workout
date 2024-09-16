import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { Workout } from "~/types/workout";

export type CreateWorkoutPayload = {
  name: string;
  isPrivate?: boolean;
  isRoutine?: boolean;
};
type CreateWorkoutError = GenericResponseError & {
  duplicatedItems?: Record<string, string>;
};
export type CreateWorkoutErrorResult = AxiosError<CreateWorkoutError>;
export type CreateWorkoutResult = AxiosResponse<Workout>;

export const createWorkout = async (
  payload: CreateWorkoutPayload
): Promise<CreateWorkoutResult> => {
  return axiosInstance.post<Workout>("/workouts", {
    ...payload,
  });
};
