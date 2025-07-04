"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  SortableItem,
} from "@workout/ui";
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
import { PlusCircle, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import WorkoutExerciseDialog from "~/components/dialogs/workout-exercise";
import Error from "~/components/error";
import Loading from "~/components/loading";
import WorkoutExerciseSets from "~/components/workout-exercise-sets";
import {
  useChangeWorkoutExercisesOrders,
  useDeleteWorkoutExercise,
  useGetWorkout,
  useGetWorkoutExercises,
  useUser,
} from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";

type DeleteWorkoutExerciseDialogState = {
  workoutExerciseId?: string;
  isOpen: boolean;
};

const WorkoutDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isAddWorkoutExerciseModalOpen, setIsAddWorkoutExerciseModalOpen] =
    useState(false);
  const [deleteWorkoutExerciseDialog, setDeleteWorkoutExerciseDialog] =
    useState<DeleteWorkoutExerciseDialogState>({
      isOpen: false,
    });

  const { data: workout, isLoading, isError, error } = useGetWorkout(id);
  const { data: workoutExerciseData, isLoading: isLoadingWorkoutExercises } =
    useGetWorkoutExercises({ workoutId: id });
  const { deleteWorkoutExerciseMutation } = useDeleteWorkoutExercise();
  const { changeWorkoutExercisesOrdersMutation } =
    useChangeWorkoutExercisesOrders();
  const { user } = useUser();
  const isOwner = useMemo(() => user?.id === workout?.userId, [user, workout]);

  const handleToggleAddWorkoutExerciseModal = () =>
    setIsAddWorkoutExerciseModalOpen((isOpen) => !isOpen);

  const handleDeleteWorkoutExercise = () => {
    if (!deleteWorkoutExerciseDialog.workoutExerciseId) return;

    deleteWorkoutExerciseMutation({
      id: deleteWorkoutExerciseDialog.workoutExerciseId,
    });
    setDeleteWorkoutExerciseDialog({
      isOpen: false,
      workoutExerciseId: undefined,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const items = workoutExerciseData.items;
    if (!items) {
      return;
    }

    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);

      const updatedItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({
          id: item.id,
          order: index,
        })
      );
      changeWorkoutExercisesOrdersMutation({ items: updatedItems });
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
    <GlobalLayout>
      <div className="py-4 px-6">
        <h1 className="text-3xl font-bold">{workout?.name || "-"}</h1>
        <p className="text-xs">
          {workout?.isPrivate ? "Private Workout" : "Public Workout"}
        </p>
        <div className="py-8">
          <h2 className="text-2xl font-bold">Exercises</h2>
          {isLoadingWorkoutExercises ? (
            <Loading />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={workoutExerciseData?.items || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="px-4">
                  {workoutExerciseData?.items.map((workoutExercise) => (
                    <SortableItem
                      key={workoutExercise.id}
                      id={workoutExercise.id}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between space-x-6 w-full">
                        <div className="w-full">
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger>
                                {workoutExercise.exercise?.name}
                              </AccordionTrigger>
                              <AccordionContent>
                                <WorkoutExerciseSets
                                  workoutExerciseId={workoutExercise.id}
                                  isOwner={isOwner}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                        {isOwner ? (
                          <Button
                            onClick={() =>
                              setDeleteWorkoutExerciseDialog({
                                workoutExerciseId: workoutExercise.id,
                                isOpen: true,
                              })
                            }
                          >
                            <Trash2 />
                          </Button>
                        ) : null}
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
        {isOwner ? (
          <Button onClick={handleToggleAddWorkoutExerciseModal}>
            <div className="flex items-center space-x-2">
              <PlusCircle />
              <p>Add New Exercise</p>
            </div>
          </Button>
        ) : null}
        <WorkoutExerciseDialog
          workoutId={id}
          isOpen={isAddWorkoutExerciseModalOpen}
          onOpenChange={handleToggleAddWorkoutExerciseModal}
          onClose={handleToggleAddWorkoutExerciseModal}
        />
      </div>
      <AlertDialog open={deleteWorkoutExerciseDialog.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to delete this workout exercise?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              workout exercise and the sets
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteWorkoutExerciseDialog({
                  ...deleteWorkoutExerciseDialog,
                  isOpen: false,
                });
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkoutExercise}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GlobalLayout>
  );
};

export default WorkoutDetailsPage;
