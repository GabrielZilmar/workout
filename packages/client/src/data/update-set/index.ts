import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { CreateSetPayload } from "~/data/create-set";
import { GenericResponseError } from "~/types/api/errors";
import { Set } from "~/types/set";

export type UpdateSetPayload = Omit<CreateSetPayload, "workoutExerciseId"> & {
  id: string;
};
export type UpdateSetErrorResult = AxiosError<GenericResponseError>;
export type UpdateSetResult = AxiosResponse<Set>;

export const updateSet = async ({
  id,
  ...payload
}: UpdateSetPayload): Promise<UpdateSetResult> => {
  return axiosInstance.patch<Set>(`/sets/${id}`, {
    ...payload,
  });
};
