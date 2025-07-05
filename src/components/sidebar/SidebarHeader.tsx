import React from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays } from "lucide-react";
import { ToggleButton } from "./components";
import LanguageSelector from "./LanguageSelector";
import { getUkrainianDayWord } from "@/utils/dates";
import { SidebarHeaderProps } from "@/types/Sidebar";

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  tripTitle,
  daysCount,
  mapLanguage,
  onToggleSidebar,
  onLanguageSelect,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <header className="mb-6 sm:mb-8 pt-4">
      <div className="flex items-center justify-between mb-2">
        <h1
          className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight flex-1"
          id="trip-title"
        >
          {tripTitle}
        </h1>
        <ToggleButton
          variant="close"
          onClick={onToggleSidebar}
          ariaControls="sidebar-content"
          ariaExpanded={true}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">
            {t("sidebar.days_of_trip", {
              count:
                i18n.language === "uk"
                  ? `${daysCount} ${getUkrainianDayWord(daysCount)}`
                  : daysCount,
            })}
          </span>
        </div>

        <LanguageSelector
          mapLanguage={mapLanguage}
          onLanguageSelect={onLanguageSelect}
        />
      </div>
    </header>
  );
};

export default SidebarHeader;
