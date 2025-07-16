"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workout/ui";
import { useTranslations } from "next-intl";
import WorkoutExerciseForm from "~/components/forms/workout-exercise";

type WorkoutExerciseDialogProps = {
  workoutId: string;
  isOpen: boolean;
  onOpenChange?: () => void;
  onClose?: () => void;
};

const WorkoutExerciseDialog: React.FC<WorkoutExerciseDialogProps> = ({
  workoutId,
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const t = useTranslations("WorkoutExerciseDialog");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <WorkoutExerciseForm
          workoutId={workoutId}
          onSubmit={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutExerciseDialog;
