"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workout/ui";
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workout Exercise</DialogTitle>
          <DialogDescription>Add an exercise to your workout</DialogDescription>
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
