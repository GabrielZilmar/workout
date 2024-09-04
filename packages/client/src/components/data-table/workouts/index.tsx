"use client";

import { Button, DataTable } from "@workout/ui";
import { useMemo, useState } from "react";
import { workoutColumns } from "~/components/data-table/workouts/columns";
import WorkoutDialog from "~/components/dialogs/workout";
import Error from "~/components/error";
import Loading from "~/components/loading";
import Pagination from "~/components/pagination";
import { DEFAULT_PER_PAGE } from "~/constants/pagination";
import { useListWorkouts } from "~/hooks";
import { debounce } from "~/lib/utils";

const INITIAL_PAGE = 1;

export function WorkoutDataTable() {
  const [isAddWorkoutModalOpen, setIsAddWorkoutModalOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const { isLoading, isError, error, data } = useListWorkouts({
    skip: (page - 1) * DEFAULT_PER_PAGE,
    take: DEFAULT_PER_PAGE,
    name: search || undefined,
  });

  const totalPages = useMemo(
    () => Math.ceil(data.count / DEFAULT_PER_PAGE),
    [data.count]
  );

  const handleSearch = debounce((search: string) => setSearch(search));
  const handleToggleAddWorkoutModal = () =>
    setIsAddWorkoutModalOpen((isOpen) => !isOpen);

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
      <DataTable
        columns={workoutColumns}
        data={data.items}
        isServerSearch
        search={search}
        onSearch={handleSearch}
        addButton={
          <Button onClick={handleToggleAddWorkoutModal}>Add Workout</Button>
        }
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        changePage={(page) => setPage(page)}
      />
      <WorkoutDialog
        isOpen={isAddWorkoutModalOpen}
        onOpenChange={handleToggleAddWorkoutModal}
        onClose={handleToggleAddWorkoutModal}
      />
    </div>
  );
}
