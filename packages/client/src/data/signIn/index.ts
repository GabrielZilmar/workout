import { axiosInstance } from "~/data/api";

export type SignInPayload = {
  email: string;
  password: string;
};

export const signIn = async (payload: SignInPayload): Promise<WorkoutUser> => {
  // console.log(process.env.REACT_APP_API_BASE_URL);

  const users = await axiosInstance.post<WorkoutUser>("/session/login", {
    ...payload,
  });

  console.log(users);
  if (!users.data) {
    throw new Error("Error to login");
  }

  return users.data;
};

export default signIn;
