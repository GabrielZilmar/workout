import { Exercise } from "~/types/exercise";

export type WorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number | null;
  exercise?: Exercise;
};
