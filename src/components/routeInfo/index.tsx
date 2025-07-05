import React from "react";
import {
  RouteInfoHeader,
  RouteMetrics,
  RouteSteps,
  RouteInfoBox,
  RouteLoadingState,
  RouteNotFoundState,
} from "./components";
import { RouteInfoProps } from "@/types/Route";

const RouteInfo: React.FC<RouteInfoProps> = ({
  distance,
  duration,
  loading,
  enabled = true,
  selectedStep,
  hoveredStep,
}) => {
  if (!enabled) return null;

  return (
    <section className="mb-6 sm:mb-8" aria-labelledby="route-info-heading">
      <RouteInfoHeader />
      <div className="glass-card-neutral rounded-lg p-4 flex flex-col items-center">
        {loading ? (
          <RouteLoadingState />
        ) : distance && duration ? (
          <>
            <RouteMetrics distance={distance} duration={duration} />
            <RouteSteps selectedStep={selectedStep} hoveredStep={hoveredStep} />
            <RouteInfoBox />
          </>
        ) : (
          <RouteNotFoundState />
        )}
      </div>
    </section>
  );
};

export default RouteInfo;
