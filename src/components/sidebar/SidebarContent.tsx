import React from "react";
import RouteInfo from "@/components/routeInfo";
import WeatherCard from "@/components/weather";
import DaysNavigation from "./DaysNavigation";
import ActivitiesSection from "./ActivitiesSection";
import { SidebarContentProps } from "@/types/Sidebar";

const SidebarContent: React.FC<SidebarContentProps> = ({
  trip,
  activeDay,
  hoveredActivity,
  selectedActivity,
  onDaySelect,
  onActivityHover,
  onActivitySelect,
  distance,
  duration,
  loading,
  enabled,
  selectedStep,
  hoveredStep,
}) => {
  return (
    <div id="sidebar-content">
      <DaysNavigation
        days={trip.days}
        activeDay={activeDay}
        onDaySelect={onDaySelect}
      />

      {activeDay && (
        <ActivitiesSection
          activeDay={activeDay}
          hoveredActivity={hoveredActivity}
          selectedActivity={selectedActivity}
          onActivityHover={onActivityHover}
          onActivitySelect={onActivitySelect}
        />
      )}

      {activeDay && (
        <RouteInfo
          distance={distance}
          duration={duration}
          loading={loading}
          enabled={enabled}
          selectedStep={selectedStep}
          hoveredStep={hoveredStep}
        />
      )}

      <WeatherCard />
    </div>
  );
};

export default SidebarContent;
