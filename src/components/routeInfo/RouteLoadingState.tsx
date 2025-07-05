import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

const RouteLoadingState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 text-blue-600">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>{t("routeInfo.calculating")}</span>
    </div>
  );
};

export default RouteLoadingState; 