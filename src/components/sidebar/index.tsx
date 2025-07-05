import React from "react";
import { useTranslation } from "react-i18next";
import { SidebarProps } from "@/types/Sidebar";
import { SidebarHeader, SidebarContent } from "./components";
import { useSidebarLogic } from "@/hooks/useSidebarLogic";

const Sidebar: React.FC<SidebarProps> = ({ mapInstanceRef }) => {
  const { t } = useTranslation();

  const {
    trip,
    activeDay,
    setActiveDay,
    hoveredActivity,
    selectedActivity,
    setHoveredActivity,
    setSelectedActivity,
    sidebarOpen,
    toggleSidebar,
    mapLanguage,
    handleLanguageSelect,
    enabled,
    distance,
    duration,
    loading,
    selectedStep,
    hoveredStep,
  } = useSidebarLogic({ mapInstanceRef });

  if (!trip) return null;

  return (
    <div
      className={`
        relative transition-all duration-300 ease-in-out z-40
        h-screen
        ${
          sidebarOpen
            ? "w-full md:w-96 lg:w-2/5 xl:w-1/3 2xl:w-1/4 translate-x-0"
            : "w-0 lg:w-0 -translate-x-full lg:translate-x-0 overflow-hidden"
        }
      `}
      id="sidebar"
    >
      <aside
        className={`h-screen glass-card border-r border-white/20 overflow-y-auto transition-all duration-300 ${
          !sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label={t("sidebar.navigation")}
        role="complementary"
      >
        <div className="p-4 sm:p-6">
          <SidebarHeader
            tripTitle={trip.trip_title}
            daysCount={trip.days.length}
            mapLanguage={mapLanguage}
            onToggleSidebar={toggleSidebar}
            onLanguageSelect={handleLanguageSelect}
          />

          <SidebarContent
            trip={trip}
            activeDay={activeDay}
            hoveredActivity={hoveredActivity}
            selectedActivity={selectedActivity}
            onDaySelect={setActiveDay}
            onActivityHover={setHoveredActivity}
            onActivitySelect={setSelectedActivity}
            distance={distance}
            duration={duration}
            loading={loading}
            enabled={enabled}
            selectedStep={selectedStep}
            hoveredStep={hoveredStep}
          />
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
