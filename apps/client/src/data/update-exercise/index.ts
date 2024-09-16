import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { CreateExercisePayload } from "~/data/create-exercise";
import { GenericResponseError } from "~/types/api/errors";
import { Exercise } from "~/types/exercise";

export type UpdateExercisePayload = Omit<CreateExercisePayload, "name"> & {
  id: string;
  name?: string;
};
type UpdateExerciseError = GenericResponseError & {
  duplicatedItems?: Record<string, string>;
};
export type UpdateExerciseErrorResult = AxiosError<UpdateExerciseError>;
export type UpdateExerciseResult = AxiosResponse<Exercise>;

export const updateExercise = async ({
  id,
  ...payload
}: UpdateExercisePayload): Promise<UpdateExerciseResult> => {
  return axiosInstance.patch<Exercise>(`/exercises/${id}`, {
    ...payload,
  });
};
