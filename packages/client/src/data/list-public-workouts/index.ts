import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { PaginationQuery } from "~/types/api/pagination-query";
import { GenericListResponse } from "~/types/generic-list-response";
import { PublicWorkout } from "~/types/workout";

export type ListPublicWorkoutsQuery = PaginationQuery & {
  searchTerm?: string;
};
export type ListPublicWorkoutResult = GenericListResponse<PublicWorkout>;
export type ListPublicWorkoutsResponse = AxiosResponse<ListPublicWorkoutResult>;
export type ListPublicWorkoutsError = AxiosError<GenericResponseError>;

export const listPublicWorkouts = async (
  query: ListPublicWorkoutsQuery
): Promise<ListPublicWorkoutsResponse> => {
  return axiosInstance.get<ListPublicWorkoutResult>("/workouts/publics", {
    params: query,
  });
};
