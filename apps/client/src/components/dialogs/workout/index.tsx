"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workout/ui";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("WorkoutDialog");
  const isEditing = useMemo(() => !!workout, [workout]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("title.update") : t("title.create")}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t("description.update") : t("description.create")}
          </DialogDescription>
        </DialogHeader>
        <WorkoutForm workout={workout} onSubmit={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDialog;
