import { Languages } from "~/types/languages";
import { Muscle } from "~/types/muscle";

export type ExerciseTranslations = {
  id: string;
  name: string;
  info: string | null;
  language: Languages;
};

export type Exercise = {
  id: string;
  name: string;
  muscleId: string;
  tutorialUrl: string | null;
  info: string | null;
  muscle?: Muscle;
  translations: ExerciseTranslations[];
};
