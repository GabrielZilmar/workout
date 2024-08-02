import { Button, cn, Input, Label } from "@workout/ui";
import Image from "next/image";
import Logo from "/public/logo.svg";
import { Lock, Mail, User } from "lucide-react";
import { ALL_ROUTES } from "~/routes";
import Link from "next/link";
import SessionLayout from "~/layouts/session.layout";

const SignUp: React.FC = () => {
  return (
    <SessionLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto"
          src={Logo}
          width={0}
          height={0}
          style={{ width: 200, height: 200 }}
          alt="Workout Logo"
          priority
        />
        <h2 className="text-center text-xl font-bold text-white-900">
          Register your account
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
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
              <Input
                id="username"
                type="username"
                autoComplete="username"
                required
                startIcon={<User />}
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
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                startIcon={<Lock />}
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
              <Input
                id="confirmPassword"
                type="confirmPassword"
                autoComplete="current-password"
                required
                startIcon={<Lock />}
              />
            </div>
          </div>

          <div>
            <Button fullWidth type="submit">
              Register
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
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
