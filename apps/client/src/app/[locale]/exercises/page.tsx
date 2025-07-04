"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workout/ui";
import { cn } from "@workout/ui/utils";
import { PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player/youtube";
import ExerciseDialog from "~/components/dialogs/exercise";
import GenericAlertDialog from "~/components/dialogs/generic";
import Error from "~/components/error";
import Loading from "~/components/loading";
import {
  useDeleteExercise,
  useListPaginatedExercises,
  useListPaginatedMuscles,
  useUser,
} from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";
import { debounce } from "~/lib/utils";
import { getYouTubeThumbnail } from "~/shared/youtube";
import { Exercise } from "~/types/exercise";

type ExerciseDialogState = {
  exercise?: Exercise;
  isOpen: boolean;
};
type DeleteExerciseDialogState = {
  exerciseId?: string;
  isOpen: boolean;
};

type ListExerciseState = {
  muscleId?: string;
  name?: string;
};

const ExercisesPage: React.FC = () => {
  const { user, isLoading: userIsLoading } = useUser();
  const [exerciseDialog, setExerciseDialog] = useState<ExerciseDialogState>({
    isOpen: false,
  });
  const [listExerciseParams, setListExerciseParams] =
    useState<ListExerciseState>();
  const [deleteExerciseDialog, setDeleteExerciseDialog] =
    useState<DeleteExerciseDialogState>({
      isOpen: false,
    });

  const {
    data: exercises,
    isLoading: isLoadingExercises,
    isError,
    error,
    fetchNextPage: fetchNextExercisePage,
    hasNextPage: hasNextExercisePage,
    isFetchingNextPage: isFetchingNextExercisePage,
  } = useListPaginatedExercises({ ...listExerciseParams });

  const {
    data: muscles,
    isLoading: isLoadingMuscles,
    fetchNextPage: fetchNextMusclePage,
    hasNextPage: hasNextMusclePage,
    isFetchingNextPage: isFetchingNextMusclePage,
  } = useListPaginatedMuscles();

  useEffect(() => {
    if (hasNextExercisePage && !isFetchingNextExercisePage) {
      fetchNextExercisePage();
    }
  }, [hasNextExercisePage, isFetchingNextExercisePage, fetchNextExercisePage]);

  useEffect(() => {
    if (hasNextMusclePage && !isFetchingNextMusclePage) {
      fetchNextMusclePage();
    }
  }, [hasNextMusclePage, isFetchingNextMusclePage, fetchNextMusclePage]);

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

  const { deleteDeleteMutation } = useDeleteExercise();
  const handleDeleteExercise = () => {
    if (!deleteExerciseDialog.exerciseId) {
      return;
    }

    deleteDeleteMutation({ id: deleteExerciseDialog.exerciseId });
    setDeleteExerciseDialog({
      isOpen: false,
    });
  };

  const handleSearch = debounce((search: string) =>
    setListExerciseParams({
      ...listExerciseParams,
      name: search || undefined,
    })
  );

  const isLoading = useMemo(
    () => isLoadingMuscles || isLoadingExercises || userIsLoading,
    [isLoadingMuscles, isLoadingExercises, userIsLoading]
  );

  if (isError) {
    const errorMessage = `${error?.response?.data?.message || ""}\n ${
      error?.response?.statusText || ""
    }`;
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <GlobalLayout>
      <div
        className={cn(
          "flex flex-col sm:flex-row",
          "space-y-4 sm:space-y-0 space-x-4",
          "mb-4"
        )}
      >
        <Input
          className="max-w-full sm:max-w-72"
          placeholder="Exercise name"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <div className="flex items-center justify-end mb-4 space-x-2">
          <Select
            value={listExerciseParams?.muscleId || ""}
            onValueChange={(id) =>
              setListExerciseParams({
                ...listExerciseParams,
                muscleId: id,
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Muscle" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea>
                <SelectGroup>
                  {muscles.map((muscle) => (
                    <SelectItem key={muscle.id} value={muscle.id}>
                      {muscle.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <Button
                  className="w-full px-2"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setListExerciseParams({
                      ...listExerciseParams,
                      muscleId: undefined,
                    });
                  }}
                >
                  Clear
                </Button>
              </ScrollArea>
            </SelectContent>
          </Select>
          {user?.isAdmin && (
            <Button
              fullWidth
              className="p-2 h-fit max-w-24"
              onClick={() => handleOpenDialog()}
            >
              <PlusIcon size={16} />
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={cn(
            "gap-4",
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader onClick={() => handleOpenDialog(exercise)}>
                <CardTitle>
                  <div
                    className={cn({
                      "flex justify-between": user?.isAdmin,
                    })}
                  >
                    {exercise.name}
                    {user?.isAdmin && (
                      <Button
                        fullWidth
                        className="p-2 h-fit max-w-16"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteExerciseDialog({
                            exerciseId: exercise.id,
                            isOpen: true,
                          });
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>{exercise.muscle?.name || ""}</CardDescription>
              </CardHeader>
              <CardContent>
                {exercise?.tutorialUrl ? (
                  <ReactPlayer
                    light={
                      <Image
                        width={1024}
                        height={0}
                        style={{ width: "100%", height: 264 }}
                        src={getYouTubeThumbnail(exercise.tutorialUrl)}
                        alt="Exercise Video Thumbnail"
                      />
                    }
                    height={264}
                    width="100%"
                    url={exercise.tutorialUrl}
                    controls
                    config={{
                      playerVars: { showinfo: 1, modestbranding: 1 },
                    }}
                  />
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GenericAlertDialog
        isOpen={deleteExerciseDialog.isOpen}
        title={"Are you sure to delete this exercise?"}
        description={
          "This action cannot be undone. This will permanently delete this exercise."
        }
        onConfirm={handleDeleteExercise}
        onCancel={() => setDeleteExerciseDialog({ isOpen: false })}
      />
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
