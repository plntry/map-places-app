import React from "react";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Activity } from "@/types/Trip";

interface ActivityCardProps {
  activity: Activity;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (activityId: number | null) => void;
  onSelect: (activityId: number | null) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}) => {
  const { t } = useTranslation();
  const isHighlighted = isHovered || isSelected;

  return (
    <div
      className={`glass-card w-full flex flex-col rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${
          isHighlighted
            ? "glass-selected !ring-4 !ring-orange-400/70 !shadow-lg"
            : ""
        }
      `}
      role="button"
      tabIndex={0}
      aria-label={`${t("activity.activity")}: ${activity.name}. ${
        activity.description
      }`}
      aria-pressed={isSelected}
      aria-describedby={`activity-coords-${activity.id}`}
      onMouseEnter={() => onHover(activity.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(isSelected ? null : activity.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(isSelected ? null : activity.id);
        }
      }}
    >
      <div className="relative w-full h-40 sm:h-48 overflow-hidden">
        <img
          src={activity.photo_url}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center">
        <h3
          className="font-bold text-base sm:text-lg mb-2 leading-tight text-gray-800"
          id={`activity-title-${activity.id}`}
        >
          {activity.name}
        </h3>
        <p className="text-sm leading-relaxed mb-3 text-gray-600">
          {activity.description}
        </p>
        <div
          className="flex items-center text-xs text-gray-500"
          id={`activity-coords-${activity.id}`}
          aria-label={`${t("activity.coordinates")}: ${t(
            "activity.latitude"
          )} ${activity.coords.lat.toFixed(4)}, ${t(
            "activity.longitude"
          )} ${activity.coords.lng.toFixed(4)}`}
        >
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {activity.coords.lat.toFixed(4)}, {activity.coords.lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
};
