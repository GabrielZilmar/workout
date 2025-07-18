"use client";

import { ColumnDef, Table, Row } from "@tanstack/react-table";
import { Button, Checkbox } from "@workout/ui";
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
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useState } from "react";
import GenericAlertDialog from "~/components/dialogs/generic";
import WorkoutDialog from "~/components/dialogs/workout";
import { useDeleteWorkout, useStartRoutine } from "~/hooks";
import { getRoutes } from "~/routes";
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
  const t = useTranslations("WorkoutActionColumn");
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
      title: t("dialog.delete.title", { quantity: selectedRows.length }),
      description: t("dialog.delete.title", { quantity: selectedRows.length }),
      confirmAction: handleDelete,
      isOpen: true,
    });
  }, [handleDelete, selectedRows, t]);

  const handleStartRoutine = useCallback(() => {
    setAlertDialog({ ...alertDialog, isOpen: false });
    if (!isHeader) {
      const workout = (params as RowProps).row.original;
      return startRoutineMutation({ workoutId: workout.id });
    }
  }, [alertDialog, startRoutineMutation, isHeader, params]);

  const handleStartRoutineDialog = useCallback(() => {
    setAlertDialog({
      title: t("dialog.start.title"),
      description: t("dialog.start.description"),
      confirmAction: handleStartRoutine,
      isOpen: true,
    });
  }, [handleStartRoutine, t]);

  return (
    <>
      <GenericAlertDialog
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
          <span>{t("tableHeader.action")}</span>
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

export const useWorkoutColumns = (): ColumnDef<Workout>[] => {
  const t = useTranslations("WorkoutColumns");
  const locale = useLocale();
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("aria.selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("aria.selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: "isPrivate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("headers.privacy")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isPrivate = row.getValue("isPrivate");

        return isPrivate ? (
          <div className="flex space-x-2 items-center">
            <BookLock />
            <p>{t("values.private")}</p>
          </div>
        ) : (
          <div className="flex space-x-2 items-center">
            <BookOpen />
            <p>{t("values.public")}</p>
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
            {t("headers.isRoutine")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isRoutine = row.getValue("isRoutine");

        return isRoutine ? (
          <div className="flex space-x-2 items-center">
            <AlarmClockCheck />
            <p>{t("values.yes")}</p>
          </div>
        ) : (
          <div className="flex space-x-2 items-center">
            <CircleX />
            <p>{t("values.no")}</p>
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
};
