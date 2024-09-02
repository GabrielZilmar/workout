import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type DeleteSetPayload = {
  id: string;
};
export type DeleteSetErrorResult = AxiosError<GenericResponseError>;
export type DeleteSetResult = AxiosResponse<boolean>;

export const deleteSet = async ({
  id,
}: DeleteSetPayload): Promise<DeleteSetResult> => {
  return axiosInstance.delete<boolean>(`/sets/${id}`);
};
