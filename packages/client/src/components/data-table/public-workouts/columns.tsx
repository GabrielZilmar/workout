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
import Link from "next/link";
import { useState } from "react";
import { useStartRoutine } from "~/hooks";
import { ALL_ROUTES } from "~/routes";
import { PublicWorkoutUser } from "~/types/user";
import { Workout } from "~/types/workout";

type PublicWorkoutActionColumnProps = {
  workoutId: string;
};
const PublicWorkoutActionColumn: React.FC<PublicWorkoutActionColumnProps> = ({
  workoutId,
}) => {
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
      <Button onClick={handleToggleDialog}>Start routine</Button>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to start this routine?
            </AlertDialogTitle>
            <AlertDialogDescription>
              It will create a new workout exercise, copying all exercises and
              sets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleToggleDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStartRoutine}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const publicWorkoutsColumns: ColumnDef<Workout>[] = [
  {
    accessorKey: "id",
    header: "Name",
    cell: ({ row }) => {
      const id = row.getValue<string>("id");

      return (
        <Link href={ALL_ROUTES.workoutDetails(id)}>
          {row.original.name || "-"}
        </Link>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Created By",
    cell: ({ row }) => row.getValue<PublicWorkoutUser>("user")?.username || "-",
  },
  {
    id: "actions",
    header: "Start routine",
    cell: ({ row }) => (
      <PublicWorkoutActionColumn workoutId={row.original.id} />
    ),
  },
];
