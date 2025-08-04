"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
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
import { useLocale, useTranslations } from "next-intl";
import { LOCALE_MAP } from "~/types/languages";

type DeleteWorkoutExerciseDialogState = {
  workoutExerciseId?: string;
  isOpen: boolean;
};

type OpenedWorkoutExercisesState = {
  [id: string]: boolean;
};

const WorkoutDetailsPage = () => {
  const t = useTranslations("WorkoutDetailsPage");
  const locale = useLocale();
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
  const [openedWorkoutExercises, setOpenedWorkoutExercise] =
    useState<OpenedWorkoutExercisesState>({});

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

  const handleToggleCard = (workoutExerciseId: string) => {
    setOpenedWorkoutExercise((prev) => ({
      ...prev,
      [workoutExerciseId]:
        prev[workoutExerciseId] !== undefined ? !prev[workoutExerciseId] : true,
    }));
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
          {workout?.isPrivate ? t("privacy.private") : t("privacy.public")}
        </p>
        <div className="py-8">
          <h2 className="text-2xl font-bold">{t("exercises.title")}</h2>
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
                <div className="px-0 sm:px-4 pt-4 space-y-4">
                  {workoutExerciseData?.items.map((workoutExercise) => (
                    <SortableItem
                      key={workoutExercise.id}
                      id={workoutExercise.id}
                      className="w-full"
                      iconSize={16}
                    >
                      <div className="flex items-center justify-between space-x-6 w-full">
                        <Card className="w-full">
                          <CardHeader
                            onClick={() => handleToggleCard(workoutExercise.id)}
                          >
                            <CardTitle>
                              <div className="flex justify-between items-center">
                                <h4 className="text-base sm:text-xl">
                                  {(
                                    workoutExercise.exercise?.translations || []
                                  ).find(
                                    (translation) =>
                                      LOCALE_MAP[translation.language] ===
                                      locale
                                  )?.name || workoutExercise.exercise?.name}
                                </h4>

                                <div className="flex items-center space-x-2">
                                  {openedWorkoutExercises[
                                    workoutExercise.id
                                  ] ? (
                                    <ChevronUp />
                                  ) : (
                                    <ChevronDown />
                                  )}
                                  {isOwner ? (
                                    <Button
                                      className="p-1 sm:p-2 h-8 w-8 sm:h-11 sm:w-11"
                                      variant="destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteWorkoutExerciseDialog({
                                          workoutExerciseId: workoutExercise.id,
                                          isOpen: true,
                                        });
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 sm:h-6 sm:w-6" />
                                    </Button>
                                  ) : null}
                                </div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          {openedWorkoutExercises[workoutExercise.id] && (
                            <CardContent>
                              <WorkoutExerciseSets
                                workoutExerciseId={workoutExercise.id}
                                isOwner={isOwner}
                              />
                            </CardContent>
                          )}
                        </Card>
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
              <p>{t("buttons.addExercise")}</p>
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
            <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.description")}
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
              {t("dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkoutExercise}>
              {t("dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GlobalLayout>
  );
};

export default WorkoutDetailsPage;
