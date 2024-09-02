"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@workout/ui";
import { PlusCircle, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import WorkoutExerciseDialog from "~/components/dialogs/workout-exercise";
import Error from "~/components/error";
import Loading from "~/components/loading";
import WorkoutExerciseSets from "~/components/workout-exercise-sets";
import {
  useDeleteWorkoutExercise,
  useGetWorkout,
  useGetWorkoutExercises,
} from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";

const WorkoutDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isAddWorkoutExerciseModalOpen, setIsAddWorkoutExerciseModalOpen] =
    useState(false);
  const { data: workout, isLoading, isError, error } = useGetWorkout(id);
  const { data: workoutExerciseData, isLoading: isLoadingWorkoutExercises } =
    useGetWorkoutExercises({ workoutId: id });
  const { deleteWorkoutExerciseMutation } = useDeleteWorkoutExercise();

  const handleToggleAddWorkoutExerciseModal = () =>
    setIsAddWorkoutExerciseModalOpen((isOpen) => !isOpen);

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
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <Button
                    onClick={() =>
                      deleteWorkoutExerciseMutation({
                        id: workoutExercise.id,
                      })
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Button onClick={handleToggleAddWorkoutExerciseModal}>
            <div className="flex items-center space-x-2">
              <PlusCircle />
              <p>Add New Exercise</p>
            </div>
          </Button>
        </div>
        <WorkoutExerciseDialog
          workoutId={id}
          isOpen={isAddWorkoutExerciseModalOpen}
          onOpenChange={handleToggleAddWorkoutExerciseModal}
          onClose={handleToggleAddWorkoutExerciseModal}
        />
      </div>
    </GlobalLayout>
  );
};

export default WorkoutDetailsPage;
