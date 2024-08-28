"use client";

import { useParams } from "next/navigation";
import Error from "~/components/error";
import Loading from "~/components/loading";
import { useGetWorkout } from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";

const WorkoutDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useGetWorkout(id);

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
    <GlobalLayout>
      <div>
        <h1 className="text-3xl font-bold">{data?.name || "-"}</h1>
        <p className="text-xs">
          {data?.isPrivate ? "Private Workout" : "Public Workout"}
        </p>
      </div>
    </GlobalLayout>
  );
};

export default WorkoutDetailsPage;
