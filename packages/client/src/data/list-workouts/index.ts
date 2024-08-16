import { AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { GenericListResponse } from "~/types/generic-list-response";
import { Workout } from "~/types/workout";

export type ListWorkoutsQuery = {
  isRoutine?: boolean;
  name?: string;
};
export type ListWorkoutResult = GenericListResponse<Workout>;
export type ListWorkoutsResult = AxiosResponse<ListWorkoutResult>;
export type ListWorkoutsError = AxiosResponse<GenericResponseError>;

export const listWorkouts = async (
  query: ListWorkoutsQuery
): Promise<ListWorkoutsResult> => {
  return axiosInstance.get<ListWorkoutResult>("/workouts", {
    params: query,
  });
};
