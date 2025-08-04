"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workout/ui";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("ExerciseDialog");
  const isEditing = useMemo(() => !!exercise, [exercise]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-auto h-full max-h-[80%]">
        <DialogHeader>
          <DialogTitle>{`${
            isEditing ? t("title.update") : t("title.create")
          }`}</DialogTitle>
          <DialogDescription>
            {isEditing ? t("description.update") : t("description.create")}
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
