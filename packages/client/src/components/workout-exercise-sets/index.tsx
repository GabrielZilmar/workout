import { useEffect } from "react";
import Error from "~/components/error";
import SetForm from "~/components/forms/set";
import Loading from "~/components/loading";
import { useListInfiniteSets } from "~/hooks";

type WorkoutExerciseSetsProps = {
  workoutExerciseId: string;
};

const WorkoutExerciseSets: React.FC<WorkoutExerciseSetsProps> = ({
  workoutExerciseId,
}) => {
  const {
    data: sets,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListInfiniteSets({ workoutExerciseId });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    <div className="px-2">
      {sets.map((set) => (
        <SetForm key={set.id} set={set} />
      ))}
    </div>
  );
};

export default WorkoutExerciseSets;
