import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type DeleteWorkoutPayload = {
  id: string;
};
export type DeleteWorkoutErrorResult = AxiosError<GenericResponseError>;
export type DeleteWorkoutResult = AxiosResponse<boolean, AxiosError>;

export const deleteWorkout = async (
  payload: DeleteWorkoutPayload
): Promise<DeleteWorkoutResult> => {
  return axiosInstance.delete<boolean>(`/workouts/${payload.id}`);
};
