"use client";

import { DataTable } from "@workout/ui";
// import { DataTable } from "~/components/data-table";
import { workoutColumns } from "~/components/data-table/workouts/columns";
import { useListWorkouts } from "~/hooks";
import LoadingSvgComponent from "~/icons/loading";
import { Workout } from "~/types/workout";

export function WorkoutDataTable() {
  const { isLoading, error, data } = useListWorkouts();

  // TODO: Handle error

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>
          <LoadingSvgComponent height={128} width={128} />
        </div>
      </div>
    );
  }

  return <DataTable columns={workoutColumns} data={data.items} />;
}
