"use client";

import { Button, buttonVariants } from "@workout/ui";
import { cn } from "@workout/ui/utils";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { Suspense, useEffect } from "react";
import { useVerifyEmail } from "~/hooks";
import SessionLayout from "~/layouts/session.layout";
import { getRoutes } from "~/routes";

const VerifyEmailPage: React.FC = () => {
  const t = useTranslations("VerifyEmailPage");
  const router = useRouter();
  const locale = useLocale();
  const routes = getRoutes(locale);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { isIdle, isPending, errorMessage, verifyEmailMutation } =
    useVerifyEmail();

  useEffect(() => {
    if (!token) {
      enqueueSnackbar(t("errors.missingToken"), { variant: "error" });
      return;
    }

    verifyEmailMutation({ token });
  }, [token, verifyEmailMutation, t]);

  const handleGoToSignIn = () => {
    router.push(routes.signIn);
  };

  if (isIdle || isPending) {
    return (
      <SessionLayout>
        <div className="flex justify-center overflow-hidden">
          <div>
            <p className={"text-primary font-bold text-2xl"}>
              {t("loading.title")}
            </p>
            <p>{t("loading.message")}</p>
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
              <p className={"text-destructive font-bold text-2xl"}>
                {t("error.title")}
              </p>
              <p>{errorMessage}.</p>
            </>
          ) : (
            <>
              <p className={"text-primary font-bold text-2xl"}>
                {t("success.title")}
              </p>
              <p>{t("success.message")}</p>
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
              {t("button.login")}
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
