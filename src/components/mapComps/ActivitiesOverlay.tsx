import React from "react";
import { useTranslation } from "react-i18next";
import { Activity } from "@/types/Trip";

interface MapActivitiesOverlayProps {
  activities: Activity[];
  selectedActivity: number | null;
  onActivitySelect: (id: number) => void;
  onActivityHover: (id: number | null) => void;
}

export const ActivitiesOverlay: React.FC<MapActivitiesOverlayProps> = ({
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

  const getMarkerClasses = (activityId: number) => {
    const isSelected = selectedActivity === activityId;
    const baseClasses =
      "size-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 border-2";

    if (isSelected) {
      return `${baseClasses} bg-orange-500 border-orange-600 border-orange-700`;
    }

    return `${baseClasses} bg-blue-500 border-blue-600`;
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
            <div className={getMarkerClasses(activity.id)} aria-hidden="true">
              {index + 1}
            </div>
            <span className="truncate">{activity.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};
