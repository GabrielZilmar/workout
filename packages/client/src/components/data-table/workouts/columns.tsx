"use client";

import { ColumnDef, Table, Row } from "@tanstack/react-table";
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
  Checkbox,
} from "@workout/ui";
import {
  AlarmClockCheck,
  ArrowUpDown,
  BookLock,
  BookOpen,
  CircleX,
  Edit2,
  Repeat,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import GenericDialog from "~/components/dialogs/generic";
import WorkoutDialog from "~/components/dialogs/workout";
import { useDeleteWorkout, useStartRoutine } from "~/hooks";
import { ALL_ROUTES } from "~/routes";
import { Workout } from "~/types/workout";

type RowProps = { row: Row<Workout> };

type WorkoutActionColumnProps = { table: Table<Workout> } & (
  | { isHeader: true }
  | (RowProps & { isHeader?: false })
);

type AlertDialogState = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmAction: () => void;
};

const WorkoutActionColumn: React.FC<WorkoutActionColumnProps> = ({
  isHeader = false,
  table,
  ...params
}) => {
  const [alertDialog, setAlertDialog] = useState<AlertDialogState>({
    isOpen: false,
    title: "",
    description: "",
    confirmAction: () => {},
  });
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const selectedRows = table.getSelectedRowModel().rows;
  const isMultipleRowsSelected = selectedRows.length > 1;
  const { deleteWorkoutMutation } = useDeleteWorkout();
  const { startRoutineMutation } = useStartRoutine();

  const handleToggleUpdateDialog = useCallback(() => {
    setIsUpdateDialogOpen((isOpen) => !isOpen);
  }, []);

  const handleDelete = useCallback(() => {
    setAlertDialog({ ...alertDialog, isOpen: false });
    if (!isHeader) {
      const workout = (params as RowProps).row.original;
      return deleteWorkoutMutation({ id: workout.id });
    }

    const ids = selectedRows.map((row) => row.original.id);
    Promise.all(ids.map((id) => deleteWorkoutMutation({ id })));
  }, [alertDialog, deleteWorkoutMutation, selectedRows, isHeader, params]);

  const handleDeleteDialog = useCallback(() => {
    setAlertDialog({
      title: `Are you sure to delete the workout${
        isMultipleRowsSelected ? "s" : ""
      }?`,
      description: `This action cannot be undone. This will permanently delete the workout${
        isMultipleRowsSelected ? "s" : ""
      } selected`,
      confirmAction: handleDelete,
      isOpen: true,
    });
  }, [handleDelete, isMultipleRowsSelected]);

  const handleStartRoutine = useCallback(() => {
    setAlertDialog({ ...alertDialog, isOpen: false });
    if (!isHeader) {
      const workout = (params as RowProps).row.original;
      return startRoutineMutation({ workoutId: workout.id });
    }
  }, [alertDialog, startRoutineMutation, isHeader, params]);

  const handleStartRoutineDialog = useCallback(() => {
    setAlertDialog({
      title: "Are you sure to start this routine?",
      description:
        "It will create a new workout exercise, copying all exercises and sets.",
      confirmAction: handleStartRoutine,
      isOpen: true,
    });
  }, [handleStartRoutine]);

  return (
    <>
      <GenericDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        description={alertDialog.description}
        onConfirm={alertDialog.confirmAction}
        onCancel={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />

      {isHeader ? (
        isMultipleRowsSelected ? (
          <div>
            <Button className="p-2 h-fit" onClick={handleDeleteDialog}>
              <Trash2 size={16} />
            </Button>
          </div>
        ) : (
          <span>Action</span>
        )
      ) : !isMultipleRowsSelected ? (
        <div className="h-fit space-x-2 flex">
          <Button className="p-2 h-fit" onClick={handleStartRoutineDialog}>
            <Repeat size={16} />
          </Button>
          <Button className="p-2 h-fit" onClick={handleToggleUpdateDialog}>
            <Edit2 size={16} />
          </Button>
          <Button className="p-2 h-fit" onClick={handleDeleteDialog}>
            <Trash2 size={16} />
          </Button>

          <WorkoutDialog
            isOpen={isUpdateDialogOpen}
            workout={(params as RowProps).row.original}
            onOpenChange={handleToggleUpdateDialog}
            onClose={handleToggleUpdateDialog}
          />
        </div>
      ) : null}
    </>
  );
};

export const workoutColumns: ColumnDef<Workout>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "isPrivate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Private/Public
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPrivate = row.getValue("isPrivate");

      return isPrivate ? (
        <div className="flex space-x-2 items-center">
          <BookLock />
          <p>Private</p>
        </div>
      ) : (
        <div className="flex space-x-2 items-center">
          <BookOpen />
          <p>Public</p>
        </div>
      );
    },
  },
  {
    accessorKey: "isRoutine",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Is Routine?
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isRoutine = row.getValue("isRoutine");

      return isRoutine ? (
        <div className="flex space-x-2 items-center">
          <AlarmClockCheck />
          <p>Yes</p>
        </div>
      ) : (
        <div className="flex space-x-2 items-center">
          <CircleX />
          <p>No</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ table }) => <WorkoutActionColumn isHeader table={table} />,
    cell: ({ row, table }) => <WorkoutActionColumn row={row} table={table} />,
  },
];
