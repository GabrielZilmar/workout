import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type DeleteExercisePayload = {
  id: string;
};
export type DeleteExerciseErrorResult = AxiosError<GenericResponseError>;
export type DeleteExerciseResult = AxiosResponse<boolean>;

export const deleteExercise = async ({
  id,
}: DeleteExercisePayload): Promise<DeleteExerciseResult> => {
  return axiosInstance.delete<boolean>(`/exercises/${id}`);
};
