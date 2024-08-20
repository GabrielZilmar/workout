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
import { AlarmClockCheck, CircleX, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDeleteWorkout } from "~/hooks";
import { Workout } from "~/types/workout";

type RowProps = { row: Row<Workout> };

type WorkoutActionColumnProps = { table: Table<Workout> } & (
  | { isHeader: true }
  | (RowProps & { isHeader?: false })
);

const WorkoutActionColumn: React.FC<WorkoutActionColumnProps> = ({
  isHeader = false,
  table,
  ...params
}) => {
  const [isDeleteWorkoutDialogOpen, setIsDeleteWorkoutDialogOpen] =
    useState<boolean>(false);
  const selectedRows = table.getSelectedRowModel().rows;
  const isMultipleRowsSelected = selectedRows.length > 1;
  const { deleteWorkoutMutation } = useDeleteWorkout();

  const handleToggleDeleteDialog = useCallback(() => {
    setIsDeleteWorkoutDialogOpen(!isDeleteWorkoutDialogOpen);
  }, [isDeleteWorkoutDialogOpen]);

  const handleDelete = useCallback(() => {
    handleToggleDeleteDialog();
    if (!isHeader) {
      const workout = (params as RowProps).row.original;
      return deleteWorkoutMutation({ id: workout.id });
    }

    const ids = selectedRows.map((row) => row.original.id);
    Promise.all(ids.map((id) => deleteWorkoutMutation({ id })));
  }, [
    handleToggleDeleteDialog,
    deleteWorkoutMutation,
    selectedRows,
    isHeader,
    params,
  ]);

  return (
    <>
      <AlertDialog open={isDeleteWorkoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Are you sure to delete the workout${
              isMultipleRowsSelected ? "s" : ""
            }?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {`This action cannot be undone. This will permanently delete the workout${
                isMultipleRowsSelected ? "s" : ""
              } selected`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleToggleDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isHeader ? (
        isMultipleRowsSelected ? (
          <div>
            <Button className="p-2 h-fit" onClick={handleToggleDeleteDialog}>
              <Trash2 size={16} />
            </Button>
          </div>
        ) : (
          <span>Action</span>
        )
      ) : !isMultipleRowsSelected ? (
        <Button className="p-2 h-fit" onClick={handleToggleDeleteDialog}>
          <Trash2 size={16} />
        </Button>
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isRoutine",
    header: "Is Routine?",
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
