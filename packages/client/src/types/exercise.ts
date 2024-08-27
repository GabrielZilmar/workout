import { Muscle } from "~/types/muscle";

export type Exercise = {
  id: string;
  name: string;
  muscleId: string;
  tutorialUrl: string | null;
  info: string | null;
  muscle?: Muscle;
};
