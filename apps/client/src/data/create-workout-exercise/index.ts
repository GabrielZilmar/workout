import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { WorkoutExercise } from "~/types/workout-exercise";

export type CreateWorkoutExercisePayload = {
  workoutId: string;
  exerciseId: string;
};
export type CreateWorkoutExerciseResult = AxiosResponse<WorkoutExercise>;
export type CreateWorkoutExerciseErrorResult = AxiosError<GenericResponseError>;

export const createWorkoutExercise = async (
  payload: CreateWorkoutExercisePayload
): Promise<CreateWorkoutExerciseResult> => {
  return axiosInstance.post<WorkoutExercise>("/workout-exercises", payload);
};
