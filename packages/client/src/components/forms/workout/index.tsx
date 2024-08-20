"use client";

import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workout } from "~/types/workout";
import { useCreateWorkout, useUpdateWorkout } from "~/hooks";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
} from "@workout/ui";
import { Dumbbell } from "lucide-react";

const WORKOUT_NAME_PLACEHOLDER = ["Chest", "Leg", "Back", "Arms", "Shoulder"];

const formSchema = z.object({
  name: z.string().min(1).max(255),
  isPrivate: z.boolean().optional(),
  isRoutine: z.boolean().optional(),
});
type FormSchema = z.infer<typeof formSchema>;
type WorkoutFormProps = {
  workout?: Workout;
  onSubmit?: (data?: FormSchema) => void;
  onCancel?: () => void;
};

const WorkoutForm: React.FC<WorkoutFormProps> = ({
  workout,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workout?.name || "",
      isPrivate: workout?.isPrivate,
      isRoutine: workout?.isRoutine,
    },
  });
  const { errors: formErrors } = form.formState;
  const workoutNamePlaceholder = useMemo(
    () =>
      WORKOUT_NAME_PLACEHOLDER[
        Math.floor(Math.random() * WORKOUT_NAME_PLACEHOLDER.length)
      ],
    []
  );

  const { createWorkoutMutation } = useCreateWorkout();
  const { updateWorkoutMutation } = useUpdateWorkout();
  const handleSubmit: SubmitHandler<FormSchema> = async (data) => {
    !!workout ? updateWorkoutMutation(data) : createWorkoutMutation(data);

    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-2"
        method="POST"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div>
          <Label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Name
          </Label>
          <div className="mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={workoutNamePlaceholder}
                      id="name"
                      type="name"
                      autoComplete="name"
                      required
                      startIcon={<Dumbbell />}
                    />
                  </FormControl>
                  <FormMessage>
                    <>{formErrors.name?.message}</>
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button fullWidth type="button" className="mt-4" onClick={onCancel}>
            Cancel
          </Button>
          <Button fullWidth type="submit" className="mt-4">
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkoutForm;
