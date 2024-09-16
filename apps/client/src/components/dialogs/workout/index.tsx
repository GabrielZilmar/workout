"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workout/ui";
import { useMemo } from "react";
import WorkoutForm from "~/components/forms/workout";
import { Workout } from "~/types/workout";

type WorkoutDialogProps = {
  workout?: Workout;
  isOpen: boolean;
  onOpenChange?: () => void;
  onClose?: () => void;
};

const WorkoutDialog: React.FC<WorkoutDialogProps> = ({
  workout,
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const isEditing = useMemo(() => !!workout, [workout]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${
            isEditing ? "Update" : "Create"
          } workout`}</DialogTitle>
          <DialogDescription>
            {`${
              isEditing ? "Update" : "Create"
            } your workout. Choice if it's public or private, if it's a routine...`}
          </DialogDescription>
        </DialogHeader>
        <WorkoutForm workout={workout} onSubmit={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDialog;
