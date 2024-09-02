import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWorkoutExercise } from "~/hooks";
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
  const { errors: formErrors } = form.formState;
  const { createWorkoutExerciseMutation } = useCreateWorkoutExercise();

  const handleCreateWorkoutExercise = async (data: FormSchema) => {
    createWorkoutExerciseMutation({
      workoutId,
      ...data,
    });

    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateWorkoutExercise)}
        className="flex flex-col space-y-4"
      >
        <div>
          <Label
            htmlFor="exerciseId"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Drops
          </Label>
          <FormField
            control={form.control}
            name="exerciseId"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row md:space-x-4 md:items-center">
                <FormControl>
                  <Input {...field} type="number" required />
                </FormControl>
                <FormMessage>
                  <>{formErrors.exerciseId}</>
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
      </form>

      <div className="flex space-x-4">
        <Button fullWidth type="button" className="mt-4" onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth type="submit" className="mt-4">
          Create Workout Exercise
        </Button>
      </div>
    </Form>
  );
};

export default WorkoutExerciseForm;
