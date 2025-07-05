import React from "react";
import { useTranslation } from "react-i18next";
import { Dot } from "../Dot";
import { Activity } from "@/types/Trip";
import { getMarkerClasses } from "@/utils/styles";

interface MapActivitiesOverlayProps {
  activities: Activity[];
  selectedActivity: number | null;
  onActivitySelect: (id: number) => void;
  onActivityHover: (id: number | null) => void;
}

const ActivitiesOverlay: React.FC<MapActivitiesOverlayProps> = ({
  activities,
  selectedActivity,
  onActivitySelect,
  onActivityHover,
}) => {
  const { t } = useTranslation();

  const handleActivityClick = (activityId: number) => {
    onActivitySelect(activityId);
  };

  const handleActivityKeyDown = (
    e: React.KeyboardEvent,
    activityId: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivitySelect(activityId);
    }
  };

  const getActivityItemClasses = (activityId: number) => {
    const baseClasses =
      "flex items-center gap-2 text-xs sm:text-sm transition-colors duration-200 cursor-pointer !min-h-0 !min-w-0";
    const selectedClasses =
      selectedActivity === activityId
        ? "text-orange-600 font-medium"
        : "text-gray-700";

    return `${baseClasses} ${selectedClasses}`;
  };

  return (
    <aside
      className="absolute bottom-4 left-4 glass-card rounded-xl p-3 sm:p-4 max-w-xs sm:max-w-sm z-10"
      role="complementary"
      aria-labelledby="map-activities-heading"
    >
      <h3
        className="font-semibold mb-2 text-sm sm:text-base"
        id="map-activities-heading"
      >
        {t("map.activities_on_map")}
      </h3>

      <ul className="space-y-2" role="list">
        {activities.map((activity, index) => (
          <li
            key={activity.id}
            className={getActivityItemClasses(activity.id)}
            role="button"
            tabIndex={0}
            aria-label={`${t("activity.activity")} ${index + 1}: ${
              activity.name
            }`}
            aria-pressed={selectedActivity === activity.id}
            onClick={() => handleActivityClick(activity.id)}
            onKeyDown={(e) => handleActivityKeyDown(e, activity.id)}
            onMouseEnter={() => onActivityHover(activity.id)}
            onMouseLeave={() => onActivityHover(null)}
          >
            <Dot
              number={index + 1}
              className={getMarkerClasses(selectedActivity === activity.id)}
            />
            <span className="truncate">{activity.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ActivitiesOverlay;
