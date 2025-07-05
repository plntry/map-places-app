import React from "react";
import { useTranslation } from "react-i18next";
import { DayCard } from "./components";
import { DaysNavigationProps } from "@/types/Sidebar";

const DaysNavigation: React.FC<DaysNavigationProps> = ({
  days,
  activeDay,
  onDaySelect,
}) => {
  const { t } = useTranslation();

  return (
    <nav className="mb-6 sm:mb-8" aria-labelledby="route-heading">
      <h2
        className="text-lg font-semibold text-gray-800 mb-4"
        id="route-heading"
      >
        {t("sidebar.route")}
      </h2>
      <ul className="space-y-3" role="list">
        {days.map((day) => (
          <li key={day.id} role="listitem">
            <DayCard
              key={day.id}
              day={day}
              isActive={activeDay?.id === day.id}
              onClick={() => onDaySelect(day)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DaysNavigation;
