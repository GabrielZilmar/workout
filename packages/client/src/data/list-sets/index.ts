import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { PaginationQuery } from "~/types/api/pagination-query";
import { GenericListResponse } from "~/types/generic-list-response";
import { Set } from "~/types/set";

export type ListSetsParams = PaginationQuery & {
  workoutExerciseId: string;
};

export type ListSetsResult = GenericListResponse<Set>;
export type ListSetsResponse = AxiosResponse<ListSetsResult>;
export type ListSetsError = AxiosError<GenericResponseError>;

export const listSets = async ({
  workoutExerciseId,
  ...params
}: ListSetsParams): Promise<ListSetsResponse> => {
  return axiosInstance.get<ListSetsResult>(
    `/sets/workout-exercise/${workoutExerciseId}`,
    { params }
  );
};
