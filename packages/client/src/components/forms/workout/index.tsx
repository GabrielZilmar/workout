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
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
} from "@workout/ui";
import { cn } from "@workout/ui/utils";
import { Dumbbell } from "lucide-react";

type RadioGroupItems = {
  value: "yes" | "no";
  label: string;
};

const WORKOUT_NAME_PLACEHOLDER = ["Chest", "Leg", "Back", "Arms", "Shoulder"];
const RADIO_GROUP_ITEMS: RadioGroupItems[] = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

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
      isPrivate: workout?.isPrivate || true,
      isRoutine: workout?.isRoutine || false,
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
    !!workout
      ? updateWorkoutMutation({ id: workout.id, ...data })
      : createWorkoutMutation(data);

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
          <div className="mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
        <div
          className={cn(
            "flex flex-col sm:flex-row space-y-2 sm:space-y-0",
            "justify-around mt-2"
          )}
        >
          <FormField
            control={form.control}
            name="isRoutine"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Is routine?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value === "yes");
                    }}
                    defaultValue={field.value ? "yes" : "no"}
                    className="flex space-x-4"
                  >
                    {RADIO_GROUP_ITEMS.map(({ value, label }) => (
                      <FormItem
                        key={value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={value} id={value} />
                        </FormControl>
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Is Private?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value === "yes");
                    }}
                    defaultValue={field.value ? "yes" : "no"}
                    className="flex space-x-4"
                  >
                    {RADIO_GROUP_ITEMS.map(({ value, label }) => (
                      <FormItem
                        key={value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={value} id={value} />
                        </FormControl>
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-4">
          <Button fullWidth type="button" className="mt-4" onClick={onCancel}>
            Cancel
          </Button>
          <Button fullWidth type="submit" className="mt-4">
            {workout ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkoutForm;
