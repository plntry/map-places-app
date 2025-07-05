import React from "react";
import { useTranslation } from "react-i18next";

const RouteNotFoundState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-gray-500 text-sm">{t("routeInfo.not_found")}</div>
  );
};

export default RouteNotFoundState;
