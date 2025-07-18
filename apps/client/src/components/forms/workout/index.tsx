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
import { useTranslations } from "next-intl";

type RadioGroupItems = {
  value: "yes" | "no";
  label: string;
};

const getFormSchema = (
  t: (
    key: string,
    params?: Record<string, string | number | Date> | undefined
  ) => string
) => {
  const formSchema = z.object({
    name: z
      .string()
      .min(1, t("minLength", { length: 1 }))
      .max(255, t("maxLength", { length: 255 })),
    isPrivate: z.boolean().optional(),
    isRoutine: z.boolean().optional(),
  });
  return formSchema;
};

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;
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
  const zt = useTranslations("Zod");
  const formSchema = getFormSchema(zt);
  const t = useTranslations("WorkoutForm");
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workout?.name || "",
      isPrivate: workout?.isPrivate === undefined ? true : workout.isPrivate,
      isRoutine: workout?.isRoutine || false,
    },
  });
  const { errors: formErrors } = form.formState;

  const WORKOUT_NAME_PLACEHOLDER = [
    t("placeholders.chest"),
    t("placeholders.leg"),
    t("placeholders.back"),
    t("placeholders.arms"),
    t("placeholders.shoulder"),
  ];
  const RADIO_GROUP_ITEMS: RadioGroupItems[] = [
    { value: "no", label: t("radio.no") },
    { value: "yes", label: t("radio.yes") },
  ];

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
                  <FormLabel>{t("labels.name")}</FormLabel>
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
                <FormLabel>{t("labels.isRoutine")}</FormLabel>
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
                <FormLabel>{t("labels.isPrivate")}</FormLabel>
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
            {t("buttons.cancel")}
          </Button>
          <Button fullWidth type="submit" className="mt-4">
            {workout ? t("buttons.submit.update") : t("buttons.submit.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkoutForm;
