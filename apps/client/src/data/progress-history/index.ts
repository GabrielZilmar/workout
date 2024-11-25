import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "~/data/api";

type Item = {
  [key: string]: number;
};
type Progress = {
  progress: Item[];
};

export type GetProgressHistory = AxiosResponse<Progress, AxiosError>;

export const getProgressHistory = async (
  exerciseId: string
): Promise<GetProgressHistory> => {
  return axiosInstance.get<Progress>(
    `/exercises/progress-history/${exerciseId}`
  );
};

export default getProgressHistory;
