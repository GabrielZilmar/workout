import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { Exercise } from "~/types/exercise";

export type CreateExercisePayload = {
  name: string;
  muscleId: string;
  tutorialUrl?: string;
  info?: string;
};

type CreateExerciseError = GenericResponseError & {
  duplicatedItems?: Record<string, string>;
};
export type CreateExerciseErrorResult = AxiosError<CreateExerciseError>;
export type CreateExerciseResult = AxiosResponse<Exercise>;

export const createExercise = async (
  payload: CreateExercisePayload
): Promise<CreateExerciseResult> => {
  return axiosInstance.post<Exercise>("/exercises", {
    ...payload,
  });
};
