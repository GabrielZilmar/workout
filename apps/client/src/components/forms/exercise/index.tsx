import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Exercise, ExerciseTranslations } from "~/types/exercise";
import {
  useCreateExercise,
  useListPaginatedMuscles,
  useUpdateExercise,
} from "~/hooks";
import {
  Button,
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
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Textarea,
} from "@workout/ui";
import { cn } from "@workout/ui/utils";
import { useEffect, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import Loading from "~/components/loading";
import { Languages, LANGUAGES_ARRAY } from "~/types/languages";
import { useTranslations } from "next-intl";

const languagesEnum = z.enum(LANGUAGES_ARRAY);

const translationSchema = z.object({
  name: z.string().max(255),
  info: z.string().optional(),
  language: languagesEnum,
});

const formSchema = z.object({
  name: z.string().max(255),
  muscleId: z.string().uuid(),
  tutorialUrl: z.string().url().max(255).optional(),
  info: z.string().optional(),
  translations: z.array(translationSchema).optional(),
});
type FormSchema = z.infer<typeof formSchema>;
type ExerciseFormProps = {
  exercise?: Exercise;
  onSubmit?: (data?: FormSchema) => void;
  onCancel?: () => void;
};

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exercise,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslations("ExerciseForm");
  const translationMap = useMemo(() => {
    const map = new Map<Languages, ExerciseTranslations>();
    exercise?.translations?.forEach((translation) => {
      map.set(translation.language, translation);
    });
    return map;
  }, [exercise]);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: exercise?.name || "",
      muscleId: exercise?.muscleId || undefined,
      tutorialUrl: exercise?.tutorialUrl || undefined,
      info: exercise?.info || undefined,
      translations: LANGUAGES_ARRAY.map((language) => {
        const translation = translationMap.get(language);
        return {
          id: translation?.id || undefined,
          name: translation?.name || "",
          info: translation?.info || "",
          language,
        };
      }),
    },
  });
  const { errors: formErrors } = form.formState;

  const {
    data: muscles,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListPaginatedMuscles();
  const { createExerciseMutation } = useCreateExercise();
  const { updateExerciseMutation } = useUpdateExercise();

  const handleSubmit: SubmitHandler<FormSchema> = async (data) => {
    const sanitizedData = {
      ...data,
      info: !data.info ? null : data.info,
      tutorialUrl: !data.tutorialUrl ? null : data.tutorialUrl,
      translations: data.translations?.length
        ? data.translations.filter((item) => !!item.name)
        : null,
    };
    !!exercise
      ? updateExerciseMutation({
          id: exercise.id,
          ...sanitizedData,
          translations: (sanitizedData.translations || []).map(
            (translation) => ({
              id: translationMap.get(translation.language)?.id,
              ...translation,
            })
          ),
        })
      : createExerciseMutation(sanitizedData);

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
        className="space-y-2"
        method="POST"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
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
                    name="name"
                    id="name"
                    type="name"
                    autoComplete="name"
                    required
                  />
                </FormControl>
                <FormMessage>
                  <>{formErrors.name?.message}</>
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="mt-2">
          <FormField
            control={form.control}
            name="muscleId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("labels.muscleId")}</FormLabel>
                <Popover modal>
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
                            ? muscles.find(
                                (muscle) => muscle.id === field.value
                              )?.name
                            : t("placeholders.selectMuscle")}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <ScrollArea>
                      <Command>
                        <CommandInput
                          placeholder={t("placeholders.searchMuscle")}
                        />
                        {isLoading ? (
                          <Loading className="h-fit" />
                        ) : (
                          <CommandList className="max-h-64">
                            <CommandEmpty>
                              {t("command.noMuscleFound")}
                            </CommandEmpty>
                            <CommandGroup>
                              {muscles.map((muscle) => (
                                <CommandItem
                                  key={muscle.id}
                                  value={muscle.name}
                                  onSelect={() => {
                                    form.setValue("muscleId", muscle.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      muscle.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {muscle.name}
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
        </div>
        <div className="mt-2">
          <FormField
            control={form.control}
            name="tutorialUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.tutorialUrl")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    name="tutorialUrl"
                    id="tutorialUrl"
                    type="url"
                  />
                </FormControl>
                <FormMessage>
                  <>{formErrors.tutorialUrl?.message}</>
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="mt-2">
          <FormField
            control={form.control}
            name="info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.info")}</FormLabel>
                <FormControl>
                  <Textarea {...field} name="info" id="info" />
                </FormControl>
                <FormMessage>
                  <>{formErrors.info?.message}</>
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 space-y-2">
          <FormLabel className="text-base">
            {t("labels.translations")}
          </FormLabel>
          {LANGUAGES_ARRAY.map((lang, index) => (
            <div key={lang} className="space-y-1 border p-4 rounded-xl">
              <FormLabel className="text-muted-foreground">
                {t("labels.lang", { lang })}
              </FormLabel>

              <FormField
                control={form.control}
                name={`translations.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("translation.name")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("placeholders.translationName", {
                          lang,
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`translations.${index}.info`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("translation.info")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        name={`translations.${index}.info`}
                        id={`translations.${index}.info`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button fullWidth type="button" className="mt-4" onClick={onCancel}>
            {t("buttons.cancel")}
          </Button>
          <Button fullWidth type="submit" className="mt-4">
            {exercise ? t("buttons.submit.update") : t("buttons.submit.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExerciseForm;
