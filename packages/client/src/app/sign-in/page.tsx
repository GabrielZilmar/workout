"use client";

import {
  Button,
  Input,
  cn,
  Label,
  Form,
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  PasswordInput,
} from "@workout/ui";
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
import { ALL_ROUTES } from "~/routes";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignIn() {
  const form = useForm<SignInPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors: formErrors } = form.formState;

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
          Sign in to your account
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
                Email
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
                  Password
                </Label>
                <div className="text-sm cursor-not-allowed">
                  <a
                    href="#"
                    className={cn(
                      "font-semibold text-indigo-600 hover:text-indigo-500",
                      "disabled pointer-events-none"
                    )}
                  >
                    Forgot password?
                  </a>
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
                Sign in
              </Button>
            </div>
          </form>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not have an account?{" "}
          <Link
            href={ALL_ROUTES.signUp}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create now
          </Link>
        </p>
      </div>
    </SessionLayout>
  );
}
