"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@workout/ui";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useStartRoutine } from "~/hooks";
import { getRoutes } from "~/routes";
import { PublicWorkoutUser } from "~/types/user";
import { Workout } from "~/types/workout";

type PublicWorkoutActionColumnProps = {
  workoutId: string;
};
const PublicWorkoutActionColumn: React.FC<PublicWorkoutActionColumnProps> = ({
  workoutId,
}) => {
  const t = useTranslations("PublicWorkoutActionColumn");
  const [isOpen, setIsOpen] = useState(false);
  const { startRoutineMutation } = useStartRoutine();

  const handleStartRoutine = () => {
    startRoutineMutation({ workoutId });
    setIsOpen(false);
  };

  const handleToggleDialog = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div>
      <Button onClick={handleToggleDialog}>{t("button.start")}</Button>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleToggleDialog}>
              {t("dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStartRoutine}>
              {t("dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const usePublicWorkoutsColumns = (): ColumnDef<Workout>[] => {
  const t = useTranslations("PublicWorkoutsColumns");
  const locale = useLocale();
  return [
    {
      accessorKey: "name",
      header: t("headers.name"),
      cell: ({ row }) => {
        const routes = getRoutes(locale);
        const id = row.original.id;
        const name = row.getValue<string>("name");

        return (
          <Button variant="link">
            <Link href={routes.workoutDetails(id)}>{name || "-"}</Link>
          </Button>
        );
      },
    },
    {
      accessorKey: "user",
      header: t("headers.createdBy"),
      cell: ({ row }) =>
        row.getValue<PublicWorkoutUser>("user")?.username || "-",
    },
    {
      id: "actions",
      header: t("headers.startRoutine"),
      cell: ({ row }) => (
        <PublicWorkoutActionColumn workoutId={row.original.id} />
      ),
    },
  ];
};
