"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@workout/ui";
import { AlarmClockCheck, CircleX } from "lucide-react";
import { Workout } from "~/types/workout";

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
        <div className="flex space-x-2">
          <AlarmClockCheck />
          <p>Yes</p>
        </div>
      ) : (
        <div className="flex space-x-2">
          <CircleX />
          <p>No</p>
        </div>
      );
    },
  },
];
