import { PublicWorkoutUser } from "~/types/user";

export type Workout = {
  id: string;
  name: string;
  userId: string;
  isPrivate?: boolean;
  isRoutine?: boolean;
};

export type PublicWorkout = Workout & {
  user: PublicWorkoutUser;
};
