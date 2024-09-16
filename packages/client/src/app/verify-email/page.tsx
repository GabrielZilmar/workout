"use client";

import { Button, buttonVariants } from "@workout/ui";
import { cn } from "@workout/ui/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { Suspense, useEffect } from "react";
import { useVerifyEmail } from "~/hooks";
import SessionLayout from "~/layouts/session.layout";
import { ALL_ROUTES } from "~/routes";

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { isIdle, isPending, errorMessage, verifyEmailMutation } =
    useVerifyEmail();

  useEffect(() => {
    if (!token) {
      enqueueSnackbar("Missing verify email token", { variant: "error" });
      return;
    }

    verifyEmailMutation({ token });
  }, [token, verifyEmailMutation]);

  const handleGoToSignIn = () => {
    router.push(ALL_ROUTES.signIn);
  };

  if (isIdle || isPending) {
    return (
      <SessionLayout>
        <div className="flex justify-center overflow-hidden">
          <div>
            <p className={"text-primary font-bold text-2xl"}>Loading</p>
            <p>Verifying your email...</p>
          </div>
        </div>
      </SessionLayout>
    );
  }

  return (
    <SessionLayout>
      <div className="flex justify-center overflow-hidden">
        <div>
          {errorMessage ? (
            <>
              <p className={"text-destructive font-bold text-2xl"}>Error</p>
              <p>{errorMessage}.</p>
            </>
          ) : (
            <>
              <p className={"text-primary font-bold text-2xl"}>Congrats</p>
              <p>You have successfully created your account.</p>
            </>
          )}

          <div className="flex items-center justify-center gap-2 mt-11">
            <Button
              className={cn(
                buttonVariants({ variant: "outline" }),
                "font-bold w-full p-6"
              )}
              onClick={handleGoToSignIn}
            >
              Log in to account
            </Button>
          </div>
        </div>
      </div>
    </SessionLayout>
  );
};

export default function VerifyEmailSuspensePage() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
