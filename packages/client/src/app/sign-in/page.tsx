"use client";

import { StyledOutlineButton, Input } from "@workout/ui";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInPayload } from "~/data/signIn";
import { useSignIn } from "~/hooks";

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
    <div className="h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto"
            src="/logo.svg"
            width={0}
            height={0}
            style={{ width: "auto", height: "auto" }}
            alt="Workout Logo"
            priority
          />
          <h2 className="mt-10 text-center text-2xl font-bold text-white-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  {...register("email", { required: true })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
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
                  {...register("password", { required: true })}
                />
              </div>
            </div>

            <div>
              <StyledOutlineButton type="submit">Sign in</StyledOutlineButton>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not have an account?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Create now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
