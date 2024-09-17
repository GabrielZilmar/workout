"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  PasswordInput,
} from "@workout/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { Lock, Mail, User } from "lucide-react";
import Logo from "/public/logo.svg";
import { ALL_ROUTES } from "~/routes";
import Link from "next/link";
import SessionLayout from "~/layouts/session.layout";
import { SignUpPayload } from "~/data/sign-up";
import Validator from "~/shared/validator";
import { useSignUp } from "~/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isEmailAvailable } from "~/data/is-email-available";
import { isUsernameAvailable } from "~/data/is-username-available";

type FormFieldValues = SignUpPayload & { confirmPassword: string };

const formSchema = z
  .object({
    username: z
      .string()
      .min(4)
      .refine(async (value) => {
        try {
          const { data: isAvail } = await isUsernameAvailable(value);
          return isAvail;
        } catch (e) {
          return false;
        }
      }, "Username is already taken"),
    email: z
      .string()
      .email()
      .refine(async (value) => {
        try {
          const { data: isAvail } = await isEmailAvailable(value);
          return isAvail;
        } catch (e) {
          return false;
        }
      }, "Email is already taken"),
    password: z.string().regex(Validator.regexPasswordValidation, {
      message: "Password does not meet complexity requirements",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUp: React.FC = () => {
  const router = useRouter();
  const form = useForm<FormFieldValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { errors: formErrors } = form.formState;

  const { signUpMutation, isSuccess } = useSignUp();
  const onSubmit: SubmitHandler<FormFieldValues> = async (data) => {
    signUpMutation(data);
  };

  useEffect(() => {
    if (isSuccess) {
      router.push(ALL_ROUTES.signIn);
    }
  }, [isSuccess, router]);

  return (
    <SessionLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto"
          src={Logo}
          width={0}
          height={0}
          style={{ width: 160, height: 160 }}
          alt="Workout Logo"
          priority
        />
        <h2 className="text-center text-xl font-bold text-white-900">
          Register your account
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form
            className="space-y-2"
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
                          placeholder="test@example.com"
                          id="email"
                          type="email"
                          autoComplete="email"
                          required
                          startIcon={<Mail />}
                        />
                      </FormControl>
                      <FormMessage>
                        <>{formErrors.email?.message}</>
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                Username
              </Label>
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Username"
                          id="username"
                          type="username"
                          autoComplete="username"
                          required
                          startIcon={<User />}
                        />
                      </FormControl>
                      <FormMessage>
                        <>{formErrors.username?.message}</>
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
                          displayRuleChecker
                          required
                          startIcon={<Lock />}
                        />
                      </FormControl>
                      <FormMessage>
                        <>{formErrors.password?.message}</>
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
                  Confirm Password
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
                          id="confirmPassword"
                          autoComplete="current-password"
                          required
                          startIcon={<Lock />}
                        />
                      </FormControl>
                      <FormMessage>
                        <>{formErrors.confirmPassword?.message}</>
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <Button fullWidth type="submit" className="mt-4">
                Register
              </Button>
            </div>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href={ALL_ROUTES.signIn}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </SessionLayout>
  );
};

export default SignUp;
