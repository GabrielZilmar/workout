export type PublicWorkoutUser = {
  id: string;
  username: string;
  email: string;
};

export type WorkoutUser = PublicWorkoutUser & {
  age: number | null;
  height: number | null;
  weight: number | null;
};
