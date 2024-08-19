"use client";

import { DataTable } from "@workout/ui";
import { workoutColumns } from "~/components/data-table/workouts/columns";
import Error from "~/components/error";
import Loading from "~/components/loading";
import { useListWorkouts } from "~/hooks";

export function WorkoutDataTable() {
  const { isLoading, isError, error, data } = useListWorkouts();

  if (isError) {
    const errorMessage = `${error?.response?.data?.message || ""}\n ${
      error?.response?.statusText || ""
    }`;
    return <Error errorMessage={errorMessage} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <DataTable columns={workoutColumns} data={data.items} />;
}
