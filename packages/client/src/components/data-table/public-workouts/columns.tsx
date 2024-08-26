"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button, Checkbox } from "@workout/ui";
import { PublicWorkoutUser } from "~/types/user";
import { Workout } from "~/types/workout";

const PublicWorkoutActionColumn: React.FC = () => {
  return <Button disabled>Comming soon: Start routine</Button>;
};

export const publicWorkoutsColumns: ColumnDef<Workout>[] = [
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
    accessorKey: "user",
    header: "Created By",
    cell: ({ row }) => row.getValue<PublicWorkoutUser>("user")?.username || "-",
  },
  {
    id: "actions",
    header: "Start routine",
    cell: () => <PublicWorkoutActionColumn />,
  },
];
