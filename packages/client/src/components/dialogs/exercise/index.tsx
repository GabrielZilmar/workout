"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workout/ui";
import React, { useMemo } from "react";
import ExerciseForm from "~/components/forms/exercise";
import { Exercise } from "~/types/exercise";

type ExerciseDialogProps = {
  exercise?: Exercise;
  isOpen: boolean;
  onOpenChange?: () => void;
  onClose?: () => void;
};

const ExerciseDialog: React.FC<ExerciseDialogProps> = ({
  exercise,
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const isEditing = useMemo(() => !!exercise, [exercise]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${
            isEditing ? "Update" : "Create"
          } exercise`}</DialogTitle>
          <DialogDescription>
            {`${
              isEditing ? "Update" : "Create"
            } your exercise. Choice if it's public or private, if it's a routine...`}
          </DialogDescription>
        </DialogHeader>
        <ExerciseForm
          exercise={exercise}
          onSubmit={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDialog;
