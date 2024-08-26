"use client";

import { DataTable } from "@workout/ui";
import { useMemo, useState } from "react";
import { publicWorkoutsColumns } from "~/components/data-table/public-workouts/columns";
import Error from "~/components/error";
import Loading from "~/components/loading";
import Pagination from "~/components/pagination";
import { DEFAULT_PER_PAGE } from "~/constants/pagination";
import { useListPublicWorkouts } from "~/hooks";
import { debounce } from "~/lib/utils";

const INITIAL_PAGE = 1;

export function PublicWorkoutsDataTable() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const { isLoading, isError, error, data } = useListPublicWorkouts({
    skip: (page - 1) * DEFAULT_PER_PAGE,
    take: DEFAULT_PER_PAGE,
    name: search || undefined,
  });

  const totalPages = useMemo(
    () => Math.ceil(data.count / DEFAULT_PER_PAGE),
    [data.count]
  );

  const handleSearch = debounce((search: string) => setSearch(search));

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
        columns={publicWorkoutsColumns}
        data={data.items}
        isServerSearch
        search={search || ""}
        onSearch={handleSearch}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        changePage={(page) => setPage(page)}
      />
    </div>
  );
}
