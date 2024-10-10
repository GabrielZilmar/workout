import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

type Item = {
  id: string;
  order: number;
};

export type UpdateManySetOrdersPayload = {
  items: Item[];
};
export type UpdateManySetOrdersResult = AxiosResponse<boolean>;
export type UpdateManySetOrdersError = AxiosError<GenericResponseError>;

export const updateManySetOrders = async (
  payload: UpdateManySetOrdersPayload
): Promise<UpdateManySetOrdersResult> => {
  return axiosInstance.patch<boolean>("/sets/update-set-orders", {
    ...payload,
  });
};
