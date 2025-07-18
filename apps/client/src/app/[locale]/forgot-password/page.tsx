"use client";

import Image from "next/image";
import SessionLayout from "~/layouts/session.layout";
import Logo from "/public/logo.svg";
import ForgotPasswordForm from "~/components/forms/forgot-password";
import { useTranslations } from "next-intl";

export default function ForgotPassword() {
  const t = useTranslations("ForgotPasswordPage");

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
          {t("description")}
        </h2>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <ForgotPasswordForm />
      </div>
    </SessionLayout>
  );
}
