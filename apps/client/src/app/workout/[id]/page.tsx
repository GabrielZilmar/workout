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
} from "@workout/ui";
import { PlusCircle, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import WorkoutExerciseDialog from "~/components/dialogs/workout-exercise";
import Error from "~/components/error";
import Loading from "~/components/loading";
import WorkoutExerciseSets from "~/components/workout-exercise-sets";
import {
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
            <div className="px-4">
              {workoutExerciseData?.items.map((workoutExercise) => (
                <div
                  key={workoutExercise.id}
                  className="flex items-center justify-between space-x-6"
                >
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
              ))}
            </div>
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
