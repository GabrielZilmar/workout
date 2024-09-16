import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { PaginationQuery } from "~/types/api/pagination-query";
import { GenericListResponse } from "~/types/generic-list-response";
import { Muscle } from "~/types/muscle";

export type ListMusclesQuery = PaginationQuery & {
  name?: string;
};
export type ListMusclesResult = GenericListResponse<Muscle>;
export type ListMusclesResponse = AxiosResponse<ListMusclesResult>;
export type ListMusclesError = AxiosError<GenericResponseError>;

export const listMuscles = async (
  params: ListMusclesQuery
): Promise<ListMusclesResponse> => {
  return axiosInstance.get<ListMusclesResult>("/muscles", {
    params,
  });
};
