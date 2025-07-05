import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Day } from "@/types/Trip";

interface DayCardProps {
  day: Day;
  isActive: boolean;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, isActive, onClick }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`!glass-card p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isActive
          ? "!glass-selected text-gray-800 !ring-4 !ring-orange-400/70 !shadow-lg transform"
          : "glass-button-neutral text-gray-800 hover:!glass-selected hover:!ring-4 hover:!ring-orange-400/70 hover:!shadow-lg"
      } flex`}
      role="button"
      tabIndex={0}
      aria-label={`${t("activity.day")} ${day.id}: ${day.title}. ${
        day.activities.length
      } ${t("activity.activities")}`}
      aria-pressed={isActive}
      aria-describedby={`day-activities-${day.id}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center gap-3 w-full">
        <Calendar
          className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
            isActive ? "text-orange-600" : "text-blue-600"
          }`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm sm:text-base mb-1"
            id={`day-title-${day.id}`}
          >
            {t("activity.day")} {day.id}
          </h3>
          <p
            className={`text-sm sm:text-base leading-tight ${
              isActive ? "text-gray-700" : "text-gray-600"
            }`}
          >
            {day.title}
          </p>
        </div>
        <div
          className="flex items-center gap-1 flex-shrink-0"
          id={`day-activities-${day.id}`}
          aria-label={`${day.activities.length} активностей`}
        >
          <MapPin
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              isActive ? "text-orange-500" : "text-gray-500"
            }`}
            aria-hidden="true"
          />
          <span
            className={`text-xs sm:text-sm ${
              isActive ? "text-orange-500" : "text-gray-500"
            }`}
          >
            {day.activities.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DayCard;
