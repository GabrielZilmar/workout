"use client";

import { DataTable } from "@workout/ui";
import { useMemo, useState } from "react";
import { workoutColumns } from "~/components/data-table/workouts/columns";
import Error from "~/components/error";
import Loading from "~/components/loading";
import Pagination from "~/components/pagination";
import { DEFAULT_PER_PAGE } from "~/constants/pagination";
import { useListWorkouts } from "~/hooks";

const INITIAL_PAGE = 1;

export function WorkoutDataTable() {
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const { isLoading, isError, error, data } = useListWorkouts({
    skip: (page - 1) * DEFAULT_PER_PAGE,
    take: DEFAULT_PER_PAGE,
  });

  const totalPages = useMemo(
    () => Math.ceil(data.count / DEFAULT_PER_PAGE),
    [data.count]
  );

  if (isError) {
    const errorMessage = `${error?.response?.data?.message || ""}\n ${
      error?.response?.statusText || ""
    }`;
    return <Error errorMessage={errorMessage} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <DataTable columns={workoutColumns} data={data.items} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        changePage={(page) => setPage(page)}
      />
    </div>
  );
}
