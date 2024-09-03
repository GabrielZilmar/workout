import { Button } from "@workout/ui";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Error from "~/components/error";
import SetForm from "~/components/forms/set";
import Loading from "~/components/loading";
import { useDeleteSet, useListInfiniteSets } from "~/hooks";
import { Set } from "~/types/set";

const NEW_SET_PREFIX = "new-item";

type WorkoutExerciseSetsProps = {
  workoutExerciseId: string;
  isOwner?: boolean;
};
type SetsState = {
  id: string;
  set?: Set;
};

const WorkoutExerciseSets: React.FC<WorkoutExerciseSetsProps> = ({
  workoutExerciseId,
  isOwner = false,
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
      id: `${NEW_SET_PREFIX}-${currentSets.length}`,
    });
    setSets(currentSets);
  };

  const handleDeleteSet = (id: string) => {
    if (id.includes(NEW_SET_PREFIX)) {
      setSets(sets.filter((item) => item.id !== id));
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
          isOwner={isOwner}
          onCancel={() => handleDeleteSet(set ? set.id : id)}
          cancelLabel={<Trash2>Remove Set</Trash2>}
        />
      ))}
      {isOwner ? (
        <div className="flex justify-end">
          <Button onClick={handleInsert}>
            <PlusCircle />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default WorkoutExerciseSets;
