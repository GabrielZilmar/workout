import { useEffect, useState } from "react";
import { Button, SortableItem } from "@workout/ui";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Error from "~/components/error";
import SetForm from "~/components/forms/set";
import Loading from "~/components/loading";
import {
  useDeleteSet,
  useListInfiniteSets,
  useUpdateManySetOrders,
} from "~/hooks";
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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { deleteSetMutation } = useDeleteSet();
  const { updateManySetOrdersMutation } = useUpdateManySetOrders();

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

  const handleDragEnd = (event: DragEndEvent) => {
    const items = sets;
    if (!items) {
      return;
    }

    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);

      const updatedItems = arrayMove(items, oldIndex, newIndex);
      setSets(updatedItems);
      updateManySetOrdersMutation({
        items: updatedItems.map((item, index) => ({
          id: item.id,
          order: index,
        })),
      });
    }
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sets} strategy={verticalListSortingStrategy}>
          {sets.map(({ id, set }) => (
            <SortableItem key={id} id={id} className="w-full">
              <SetForm
                workoutExerciseId={workoutExerciseId}
                set={set}
                isOwner={isOwner}
                onCancel={() => handleDeleteSet(set ? set.id : id)}
                cancelLabel={<Trash2>Remove Set</Trash2>}
              />
            </SortableItem>
          ))}
          {isOwner ? (
            <div className="flex justify-end">
              <Button onClick={handleInsert}>
                <PlusCircle />
              </Button>
            </div>
          ) : null}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default WorkoutExerciseSets;
