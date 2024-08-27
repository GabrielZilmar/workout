"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@workout/ui";
import ReactPlayer from "react-player";
import Error from "~/components/error";
import Loading from "~/components/loading";
import { useListExercises } from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";

const ExercisesPage: React.FC = () => {
  const { data, isLoading, isError, error } = useListExercises();

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
      <div
        className={cn(
          "gap-4 mt-4",
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {data.items.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader>
              <CardTitle>{exercise.name}</CardTitle>
              <CardDescription>{exercise.muscle?.name || ""}</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactPlayer
                height={264}
                width="100%"
                url={exercise.tutorialUrl || ""}
                controls
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </GlobalLayout>
  );
};

export default ExercisesPage;
