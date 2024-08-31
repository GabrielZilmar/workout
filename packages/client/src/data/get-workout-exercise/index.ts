import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";
import { PaginationQuery } from "~/types/api/pagination-query";
import { GenericListResponse } from "~/types/generic-list-response";
import { WorkoutExercise } from "~/types/workout-exercise";

export type GetWorkoutExerciseParams = {
  workoutId: string;
} & PaginationQuery;
export type GetWorkoutExerciseResponse = AxiosResponse<
  GenericListResponse<WorkoutExercise>
>;
export type GetWorkoutExerciseError = AxiosError<GenericResponseError>;

export const getWorkoutExercise = async ({
  workoutId,
  ...params
}: GetWorkoutExerciseParams): Promise<GetWorkoutExerciseResponse> => {
  return axiosInstance.get<GenericListResponse<WorkoutExercise>>(
    `/workout-exercises/${workoutId}`,
    { params }
  );
};
