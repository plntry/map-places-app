import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Dot } from "../Dot";
import { getMarkerClasses } from "@/utils/styles";
import { RouteStepsProps } from "@/types/Route";

const RouteSteps: React.FC<RouteStepsProps> = ({
  selectedStep,
  hoveredStep,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full mt-2 mb-2">
      <div className="text-sm font-medium text-center text-gray-700 mb-2">
        {t("routeInfo.steps_between_locations")}
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Dot
          number={1}
          className={getMarkerClasses(
            (selectedStep === 1 || hoveredStep === 1) &&
              (selectedStep != null || hoveredStep != null),
            "size-7 text-base"
          )}
        />
        <ArrowRight className="size-5 text-gray-400" />
        <Dot
          number={2}
          className={getMarkerClasses(
            (selectedStep === 2 || hoveredStep === 2) &&
              (selectedStep != null || hoveredStep != null),
            "size-7 text-base"
          )}
        />
      </div>
    </div>
  );
};

export default RouteSteps;
