import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWorkoutExercise, useListPaginatedExercises } from "~/hooks";
import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@workout/ui";

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect } from "react";
import Loading from "~/components/loading";

const formSchema = z.object({
  exerciseId: z.string().uuid(),
});
type FormSchema = z.infer<typeof formSchema>;
type WorkoutExerciseFormProps = {
  workoutId: string;
  onSubmit?: (data?: FormSchema) => void;
  onCancel?: () => void;
};

const WorkoutExerciseForm: React.FC<WorkoutExerciseFormProps> = ({
  workoutId,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exerciseId: "",
    },
  });
  const { createWorkoutExerciseMutation } = useCreateWorkoutExercise();
  const {
    data: exercises,
    isLoading,

    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListPaginatedExercises();

  const handleCreateWorkoutExercise = async (data: FormSchema) => {
    createWorkoutExerciseMutation({
      workoutId,
      ...data,
    });

    if (onSubmit) {
      onSubmit(data);
    }
  };

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateWorkoutExercise)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="exerciseId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel> Select a new exercise for your workout</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-4/6 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <div className="text-ellipsis overflow-hidden">
                        {field.value
                          ? exercises.find(
                              (exercise) => exercise.id === field.value
                            )?.name
                          : "Select an exercise"}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <ScrollArea>
                    <Command>
                      <CommandInput placeholder="Search exercise..." />
                      {isLoading ? (
                        <Loading className="h-fit" />
                      ) : (
                        <CommandList className="max-h-64">
                          <CommandEmpty>No exercise found.</CommandEmpty>
                          <CommandGroup>
                            {exercises.map((exercise) => (
                              <CommandItem
                                key={exercise.id}
                                value={exercise.name}
                                onSelect={() => {
                                  form.setValue("exerciseId", exercise.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    exercise.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {exercise.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      )}
                    </Command>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <Button fullWidth type="button" className="mt-4" onClick={onCancel}>
            Cancel
          </Button>
          <Button fullWidth type="submit" className="mt-4">
            Create Workout Exercise
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkoutExerciseForm;
