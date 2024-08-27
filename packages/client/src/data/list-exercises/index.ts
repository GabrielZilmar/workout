import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { PaginationQuery } from "~/types/api/pagination-query";
import { SimpleExercise } from "~/types/exercise";
import { GenericListResponse } from "~/types/generic-list-response";

export type ListExercisesQuery = PaginationQuery & {
  name?: string;
  muscleId?: string;
};
export type ListExercisesResult = GenericListResponse<SimpleExercise>;
export type ListExercisesResponse = AxiosResponse<ListExercisesResult>;
export type ListExercisesError = AxiosError<GenericResponseError>;

export const listExercises = async (
  params: ListExercisesQuery
): Promise<ListExercisesResponse> => {
  return axiosInstance.get<ListExercisesResult>("/exercises", {
    params,
  });
};
