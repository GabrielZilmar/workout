"use client";

import {
  Button,
  Input,
  Label,
  Form,
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  PasswordInput,
} from "@workout/ui";
import { cn } from "@workout/ui/utils";
import z from "zod";
import { Lock, Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Logo from "/public/logo.svg";
import { SignInPayload } from "~/data/sign-in";
import { useSignIn } from "~/hooks";
import Link from "next/link";
import SessionLayout from "~/layouts/session.layout";
import { getRoutes } from "~/routes";
import { useLocale, useTranslations } from "next-intl";

export default function SignIn() {
  const zt = useTranslations("Zod");
  const formSchema = z.object({
    email: z
      .string()
      .max(255, zt("maxLength", { length: 255 }))
      .email(zt("email")),
    password: z
      .string()
      .min(8, zt("minLength", { length: 8 }))
      .max(255, zt("maxLength", { length: 255 })),
  });

  const t = useTranslations("SignInPage");
  const form = useForm<SignInPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors: formErrors } = form.formState;
  const locale = useLocale();
  const routes = getRoutes(locale);

  const { signInMutation } = useSignIn();

  const onSubmit: SubmitHandler<SignInPayload> = async (data) => {
    signInMutation(data);
  };

  return (
    <SessionLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto"
          src={Logo}
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          alt="Workout Logo"
          priority
        />
        <h2 className="mt-2 text-center text-2xl font-bold text-white-900">
          {t("signIn")}
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
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
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white-900"
                >
                  {t("labels.password")}
                </Label>
                <div className="text-sm">
                  <Link
                    href={routes.forgotPassword}
                    className={cn(
                      "font-semibold text-indigo-600 hover:text-indigo-500"
                    )}
                  >
                    {t("links.forgot")}
                  </Link>
                </div>
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
              <Button fullWidth type="submit">
                {t("buttons.submit")}
              </Button>
            </div>
          </form>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {t("noAccount")}{" "}
          <Link
            href={routes.signUp}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {t("links.create")}
          </Link>
        </p>
      </div>
    </SessionLayout>
  );
}
