import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { Exercise } from "~/types/exercise";
import { Languages } from "~/types/languages";

export type CreateExerciseTranslationPayload = {
  name: string;
  info?: string | null;
  language: Languages;
};

export type CreateExercisePayload = {
  name: string;
  muscleId: string;
  tutorialUrl?: string | null;
  info?: string | null;
  translations?: CreateExerciseTranslationPayload[] | null;
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
