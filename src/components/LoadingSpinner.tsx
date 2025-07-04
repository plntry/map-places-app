import React from 'react';
import { useTranslation } from "react-i18next";

const LoadingSpinner: React.FC<{
  message?: string;
}> = ({ message = "" }) => {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      role="status"
      aria-label={t("loading.app")}
    >
      <div className="text-center max-w-[250px] glass-card p-7 rounded-2xl">
        <div
          className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-orange-600/60 mx-auto mb-4"
          aria-hidden="true"
        ></div>
        <p className="text-xl font-medium text-gray-800 animate-pulse">
          {t("loading.loading")}
        </p>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;