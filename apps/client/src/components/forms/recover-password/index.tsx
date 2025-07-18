"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  PasswordInput,
} from "@workout/ui";
import { Lock } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Validator from "~/shared/validator";
import { useRecoverPassword } from "~/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "~/components/loading";
import Link from "next/link";
import { getRoutes } from "~/routes";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useLocale, useTranslations } from "next-intl";

const getFormSchema = (
  t: (
    key: string,
    params?: Record<string, string | number | Date> | undefined
  ) => string
) => {
  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, t("minLength", { length: 8 }))
        .regex(Validator.regexPasswordValidation, {
          message: t("passwordComplexity"),
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
  return formSchema;
};

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const RecoverPasswordForm = () => {
  const zt = useTranslations("Zod");
  const formSchema = getFormSchema(zt);
  const t = useTranslations("RecoverPasswordForm");
  const router = useRouter();
  const locale = useLocale();
  const routes = getRoutes(locale);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { errors: formErrors } = form.formState;

  const { recoverPasswordMutation, isSuccess, isPending } =
    useRecoverPassword();
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (!token) {
      enqueueSnackbar(t("errors.missingToken"), { variant: "error" });
      return;
    }

    recoverPasswordMutation({
      newPassword: data.password,
      token,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push(routes.signIn);
    }
  }, [isSuccess, router, routes]);

  return (
    <div>
      <Form {...form}>
        <form
          className="space-y-6"
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                {t("labels.password")}
              </Label>
            </div>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder={t("placeholders.password")}
                        id="password"
                        autoComplete="current-password"
                        displayRuleChecker
                        required
                        startIcon={<Lock />}
                      />
                    </FormControl>
                    <FormMessage>
                      <>{formErrors.password}</>
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                {t("labels.confirmPassword")}
              </Label>
            </div>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder={t("placeholders.confirmPassword")}
                        id="confirmPassword"
                        autoComplete="current-password"
                        required
                        startIcon={<Lock />}
                      />
                    </FormControl>
                    <FormMessage>
                      <>{formErrors.confirmPassword}</>
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            {isPending ? (
              <Loading className="h-fit" />
            ) : (
              <Button fullWidth type="submit">
                {t("buttons.submit")}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <p className="mt-10 text-center text-sm text-gray-500">
        <Link
          href={routes.signIn}
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          {t("links.returnToLogin")}
        </Link>
      </p>
    </div>
  );
};

export default RecoverPasswordForm;
