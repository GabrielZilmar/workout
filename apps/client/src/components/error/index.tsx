"use client";

import { useTranslations } from "use-intl";

type ErrorProps = {
  errorMessage?: string;
};

const Error: React.FC<ErrorProps> = ({ errorMessage }) => {
  const t = useTranslations("Error");

  return (
    <div className="h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl text-destructive font-bold text-center mb-4">
          {t("title")}
        </h1>
        <p className="text-center">{t("description")}</p>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Error;
