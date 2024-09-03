import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { CreateWorkoutPayload } from "~/data/create-workout";
import { GenericResponseError } from "~/types/api/errors";
import { Workout } from "~/types/workout";

export type UpdateWorkoutPayload = Omit<CreateWorkoutPayload, "name"> & {
  id: string;
  name?: string;
};
type UpdateWorkoutError = GenericResponseError & {
  duplicatedItems?: Record<string, string>;
};
export type UpdateWorkoutErrorResult = AxiosError<UpdateWorkoutError>;
export type UpdateWorkoutResult = AxiosResponse<Workout>;

export const updateWorkout = async ({
  id,
  ...payload
}: UpdateWorkoutPayload): Promise<UpdateWorkoutResult> => {
  return axiosInstance.patch<Workout>(`/workouts/${id}`, {
    ...payload,
  });
};
