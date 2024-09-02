import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { Set } from "~/types/set";

export type CreateSetPayload = {
  workoutExerciseId: string;
  numReps?: number;
  numDrops?: number;
  setWeight?: number;
};
export type CreateSetResult = AxiosResponse<Set>;
export type CreateSetErrorResult = AxiosError<GenericResponseError>;

export const createSet = async (
  payload: CreateSetPayload
): Promise<CreateSetResult> => {
  return axiosInstance.post<Set>("/sets", {
    ...payload,
  });
};
