"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@workout/ui";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import ExerciseDialog from "~/components/dialogs/exercise";
import Error from "~/components/error";
import Loading from "~/components/loading";
import { useListPaginatedExercises, useUser } from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";
import { Exercise } from "~/types/exercise";

type ExerciseDialogState = {
  exercise?: Exercise;
  isOpen: boolean;
};

const ExercisesPage: React.FC = () => {
  const { user, isLoading: userIsLoading } = useUser();
  const [exerciseDialog, setExerciseDialog] = useState<ExerciseDialogState>({
    isOpen: false,
  });

  const {
    data: exercises,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListPaginatedExercises();

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleOpenDialog = (exercise?: Exercise) => {
    if (!user?.isAdmin) return;

    setExerciseDialog({
      exercise,
      isOpen: true,
    });
  };

  const handleCloseDialog = () => {
    setExerciseDialog({
      ...exerciseDialog,
      isOpen: false,
    });
  };

  if (isError) {
    const errorMessage = `${error?.response?.data?.message || ""}\n ${
      error?.response?.statusText || ""
    }`;
    return <Error errorMessage={errorMessage} />;
  }

  if (isLoading || userIsLoading) {
    return <Loading />;
  }

  return (
    <GlobalLayout>
      {user?.isAdmin && (
        <div className="flex justify-end mb-4">
          <Button
            fullWidth
            className="p-2 h-fit max-w-24"
            onClick={() => handleOpenDialog()}
          >
            <PlusIcon size={16} />
          </Button>
        </div>
      )}
      <div
        className={cn(
          "gap-4",
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader onClick={() => handleOpenDialog(exercise)}>
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

      <ExerciseDialog
        isOpen={exerciseDialog.isOpen}
        exercise={exerciseDialog.exercise}
        onOpenChange={handleCloseDialog}
        onClose={handleCloseDialog}
      />
    </GlobalLayout>
  );
};

export default ExercisesPage;
