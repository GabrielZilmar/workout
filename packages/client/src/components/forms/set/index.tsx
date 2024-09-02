import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Set } from "~/types/set";
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
import { useCreateSet, useUpdateSet } from "~/hooks";

const formSchema = z.object({
  numReps: z.coerce.number().min(0).default(0),
  numDrops: z.coerce.number().min(0).default(0),
  setWeight: z.coerce.number().min(0).default(0),
});
type FormSchema = z.infer<typeof formSchema>;

type SetFormProps = {
  workoutExerciseId: string;
  set?: Set;
  onSubmit?: (data?: FormSchema) => void;
  onCancel?: (id?: string) => void;
  cancelLabel?: string | React.ReactNode;
};

const SetForm: React.FC<SetFormProps> = ({
  workoutExerciseId,
  set,
  onSubmit,
  onCancel,
  cancelLabel = "Cancel",
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numReps: set?.numReps || 0,
      numDrops: set?.numDrops || 0,
      setWeight: set?.setWeight || 0,
    },
  });
  const { errors: formErrors } = form.formState;

  const { createSetMutation } = useCreateSet();
  const { updateSetMutation } = useUpdateSet();

  const handleSubmit: SubmitHandler<FormSchema> = async (data) => {
    !!set
      ? updateSetMutation({
          id: set.id,
          ...data,
        })
      : createSetMutation({
          workoutExerciseId,
          ...data,
        });

    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(set?.id);
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-fit"
        method="POST"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col md:flex-row md:space-x-4 md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:space-x-4 md:items-center">
            <Label
              htmlFor="numReps"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Reps
            </Label>
            <FormField
              control={form.control}
              name="numReps"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row md:space-x-4 md:items-center">
                  <FormControl>
                    <Input {...field} type="number" required />
                  </FormControl>
                  <FormMessage>
                    <>{formErrors.numReps}</>
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 md:items-center">
            <Label
              htmlFor="numDrops"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Drops
            </Label>
            <FormField
              control={form.control}
              name="numDrops"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row md:space-x-4 md:items-center">
                  <FormControl>
                    <Input {...field} type="number" required />
                  </FormControl>
                  <FormMessage>
                    <>{formErrors.numDrops}</>
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 md:items-center">
            <Label
              htmlFor="setWeight"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Weight (KG)
            </Label>
            <FormField
              control={form.control}
              name="setWeight"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row md:space-x-4 md:items-center">
                  <FormControl>
                    <Input {...field} type="number" required />
                  </FormControl>
                  <FormMessage>
                    <>{formErrors.setWeight}</>
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="destructive"
            className="mt-4"
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          <Button type="submit" className="mt-4">
            {set ? "Update Set" : "Create Set"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SetForm;
