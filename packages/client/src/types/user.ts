export type PublicWorkoutUser = {
  id: string;
  username: string;
  email: string;
};

export type WorkoutUser = PublicWorkoutUser & {
  isAdmin: boolean;
  age: number | null;
  height: number | null;
  weight: number | null;
};
