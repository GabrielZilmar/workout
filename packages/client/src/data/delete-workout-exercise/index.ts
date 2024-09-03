import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

export type DeleteWorkoutExercisePayload = {
  id: string;
};
export type DeleteWorkoutExerciseErrorResult = AxiosError<GenericResponseError>;
export type DeleteWorkoutExerciseResult = AxiosResponse<boolean>;

export const deleteWorkoutExercise = async ({
  id,
}: DeleteWorkoutExercisePayload): Promise<DeleteWorkoutExerciseResult> => {
  return axiosInstance.delete<boolean>(`/workout-exercises/${id}`);
};
