"use client";

import { Button, Input, cn, Label } from "@workout/ui";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Logo from "/public/logo.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInPayload } from "~/data/sign-in";
import { useSignIn } from "~/hooks";
import Link from "next/link";
import SessionLayout from "~/layouts/session.layout";
import { ALL_ROUTES } from "~/routes";

export default function SignIn() {
  const { register, handleSubmit } = useForm<SignInPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
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
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Email
            </Label>
            <div className="mt-2">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                startIcon={<Mail />}
                {...register("email", { required: true })}
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
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                startIcon={<Lock />}
                {...register("password", { required: true })}
              />
            </div>
          </div>

          <div>
            <Button fullWidth type="submit">
              Sign in
            </Button>
          </div>
        </form>

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
