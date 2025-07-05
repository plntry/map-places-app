import React from "react";
import { useTranslation } from "react-i18next";

const RouteInfoBox: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mt-3">
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm">
        <span
          role="img"
          aria-label="Google Maps"
          className="text-lg mt-0.5"
        >
          🗺️
        </span>
        <span>{t("routeInfo.info_box")}</span>
      </div>
    </div>
  );
};

export default RouteInfoBox; 