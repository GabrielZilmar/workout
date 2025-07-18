"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
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
import Link from "next/link";
import { getRoutes } from "~/routes";
import { useRouter } from "next/navigation";
import { useSendRecoverPasswordEmail } from "~/hooks";
import { useEffect } from "react";
import Loading from "~/components/loading";
import { useLocale, useTranslations } from "next-intl";

const getFormSchema = (
  t: (
    key: string,
    params?: Record<string, string | number | Date> | undefined
  ) => string
) => {
  const formSchema = z.object({
    email: z
      .string()
      .max(255, t("maxLength", { length: 255 }))
      .email(t("email")),
  });
  return formSchema;
};

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const ForgotPasswordForm = () => {
  const zt = useTranslations("Zod");
  const formSchema = getFormSchema(zt);
  const t = useTranslations("ForgotPasswordForm");
  const router = useRouter();
  const locale = useLocale();
  const routes = getRoutes(locale);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { errors: formErrors } = form.formState;

  const { sendRecoverPasswordEmailMutation, isSuccess, isPending } =
    useSendRecoverPasswordEmail();
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    sendRecoverPasswordEmailMutation(data);
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
            <Label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              {t("labels.email")}
            </Label>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("placeholders.email")}
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        startIcon={<Mail />}
                      />
                    </FormControl>
                    <FormMessage>
                      <>{formErrors.email}</>
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

export default ForgotPasswordForm;
