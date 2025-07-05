import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock } from "lucide-react";
import { RouteMetricsProps } from "@/types/Route";

const RouteMetrics: React.FC<RouteMetricsProps> = ({ distance, duration }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center gap-8 mb-4 w-full">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <MapPin className="size-4 text-blue-500 mb-1" />
          <div className="text-xs text-gray-500 mb-1">
            {t("routeInfo.total_distance")}
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {distance < 1
            ? `${Math.round(distance * 1000)} ${t("routeInfo.meters")}`
            : `${distance.toFixed(1)} ${t("routeInfo.kilometers")}`}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <Clock className="size-4 text-green-600 mb-1" />
          <div className="text-xs text-gray-500 mb-1">
            {t("routeInfo.travel_time")}
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {Math.round(duration / 60)} {t("routeInfo.minutes")}
        </div>
      </div>
    </div>
  );
};

export default RouteMetrics;
