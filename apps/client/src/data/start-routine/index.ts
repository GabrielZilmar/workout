import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { Workout } from "~/types/workout";

export type StartRoutinePayload = {
  workoutId: string;
};
export type StartRoutineResult = AxiosResponse<Workout>;
export type StartRoutineError = AxiosError<GenericResponseError>;

export const startRoutine = async (
  payload: StartRoutinePayload
): Promise<StartRoutineResult> => {
  return axiosInstance.post<Workout>("/workouts/start-routine", {
    ...payload,
  });
};
