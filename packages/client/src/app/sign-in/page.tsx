"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { StyledOutlineButton } from "~/components/buttons";
import { StyledOutlineInput } from "~/components/input";
import { SignInPayload } from "~/data/signIn";
import { useSignIn } from "~/hooks";

export default function SignIn() {
  // TODO: Implement React Hook Form
  const [signInPayload, setSignInPayload] = useState<SignInPayload>({
    email: "",
    password: "",
  });
  const { signInMutation } = useSignIn();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInMutation(signInPayload);
  };

  return (
    <div className="h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto"
            src="/logo.svg"
            width={200}
            height={100}
            alt="Workout Logo"
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
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <StyledOutlineInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(ev) =>
                    setSignInPayload({
                      ...signInPayload,
                      email: ev.target.value,
                    })
                  }
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
                <StyledOutlineInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(ev) =>
                    setSignInPayload({
                      ...signInPayload,
                      password: ev.target.value,
                    })
                  }
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
