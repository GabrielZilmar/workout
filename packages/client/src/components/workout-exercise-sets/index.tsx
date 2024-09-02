import { Button } from "@workout/ui";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Error from "~/components/error";
import SetForm from "~/components/forms/set";
import Loading from "~/components/loading";
import { useDeleteSet, useListInfiniteSets } from "~/hooks";
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
  const { deleteSetMutation } = useDeleteSet();

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

  const handleDeleteSet = (id?: string) => {
    if (!id) {
      return;
    }

    deleteSetMutation({ id });
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
        <SetForm
          key={id}
          workoutExerciseId={workoutExerciseId}
          set={set}
          onCancel={handleDeleteSet}
          cancelLabel={<Trash2>Remove Set</Trash2>}
        />
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
