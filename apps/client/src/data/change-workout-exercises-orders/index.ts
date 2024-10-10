import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";
import { GenericResponseError } from "~/types/api/errors";

type ChangeWorkoutExercisesOrdersItem = {
  id: string;
  order: number;
};
export type ChangeWorkoutExercisesOrdersPayload = {
  items: ChangeWorkoutExercisesOrdersItem[];
};
export type ChangeWorkoutExercisesOrdersResult = AxiosResponse<boolean>;
export type ChangeWorkoutExercisesOrdersError =
  AxiosError<GenericResponseError>;

export const changeWorkoutExercisesOrders = async (
  payload: ChangeWorkoutExercisesOrdersPayload
): Promise<ChangeWorkoutExercisesOrdersResult> => {
  return axiosInstance.patch<boolean>(
    "/workout-exercises/update-workout-exercises-orders",
    { ...payload }
  );
};
