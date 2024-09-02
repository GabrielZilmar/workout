"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workout/ui";
import { useParams } from "next/navigation";
import Error from "~/components/error";
import Loading from "~/components/loading";
import WorkoutExerciseSets from "~/components/workout-exercise-sets";
import { useGetWorkout, useGetWorkoutExercises } from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";

const WorkoutDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: workout, isLoading, isError, error } = useGetWorkout(id);
  const { data: workoutExerciseData, isLoading: isLoadingWorkoutExercises } =
    useGetWorkoutExercises({ workoutId: id });

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
                <Accordion key={workoutExercise.id} type="single" collapsible>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default WorkoutDetailsPage;
