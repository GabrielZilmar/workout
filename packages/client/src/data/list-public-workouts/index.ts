import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { PaginationQuery } from "~/types/api/pagination-query";
import { GenericListResponse } from "~/types/generic-list-response";
import { Workout } from "~/types/workout";

export type ListPublicWorkoutsQuery = PaginationQuery & {
  isRoutine?: boolean;
  name?: string;
};
export type ListPublicWorkoutResult = GenericListResponse<Workout>;
export type ListPublicWorkoutsResponse = AxiosResponse<ListPublicWorkoutResult>;
export type ListPublicWorkoutsError = AxiosError<GenericResponseError>;

export const listPublicWorkouts = async (
  query: ListPublicWorkoutsQuery
): Promise<ListPublicWorkoutsResponse> => {
  return axiosInstance.get<ListPublicWorkoutResult>("/workouts/publics", {
    params: query,
  });
};
