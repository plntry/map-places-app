import React from "react";
import { useTranslation } from "react-i18next";
import { Route } from "lucide-react";

const RouteInfoHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center self-start gap-2 mb-4">
      <Route className="w-5 h-5 text-orange-600" />
      <span
        className="font-semibold text-gray-800 text-lg"
        id="route-info-heading"
      >
        {t("routeInfo.title")}
      </span>
    </div>
  );
};

export default RouteInfoHeader;
