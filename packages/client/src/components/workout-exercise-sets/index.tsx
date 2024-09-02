import { Button } from "@workout/ui";
import { PlusCircle } from "lucide-react";
import { Instrument_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import Error from "~/components/error";
import SetForm from "~/components/forms/set";
import Loading from "~/components/loading";
import { useListInfiniteSets } from "~/hooks";
import { Set } from "~/types/set";

type WorkoutExerciseSetsProps = {
  workoutExerciseId: string;
};
type SetsState = {
  id: string;
  set?: Set;
};

const WorkoutExerciseSets: React.FC<WorkoutExerciseSetsProps> = ({
  workoutExerciseId,
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListInfiniteSets({ workoutExerciseId });
  const [sets, setSets] = useState<SetsState[]>([]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    setSets(
      data.map((item) => ({
        id: item.id,
        set: { ...item },
      }))
    );
  }, [data]);

  const handleInsert = () => {
    const currentSets = [...sets];
    currentSets.push({
      id: `new-item-${currentSets.length}`,
    });
    setSets(currentSets);
  };

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
    <div className="flex flex-col gap-4 px-2">
      {sets.map(({ id, set }) => (
        <SetForm key={id} workoutExerciseId={workoutExerciseId} set={set} />
      ))}
      <div className="flex justify-end">
        <Button onClick={handleInsert}>
          <PlusCircle />
        </Button>
      </div>
    </div>
  );
};

export default WorkoutExerciseSets;
