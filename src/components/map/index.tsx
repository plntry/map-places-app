import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "@/components/LoadingSpinner";
import ActivitiesOverlay from "./ActivitiesOverlay";
import useIsSidebarFullWidth from "@/hooks/useIsSidebarFullWidth";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
import { useMapInstance } from "@/hooks/useMapInstance";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useMapCentering } from "@/hooks/useMapCentering";
import { useTrip } from "@/hooks/useTrip";
import { useOSRMRoute } from "@/hooks/useOSRMRoute";

interface MapViewProps {
  mapInstanceRef: React.RefObject<google.maps.Map | null>;
}

const MapView: React.FC<MapViewProps> = ({ mapInstanceRef }) => {
  const { t } = useTranslation();
  const {
    activeDay,
    hoveredActivity,
    selectedActivity,
    setHoveredActivity,
    setSelectedActivity,
    sidebarOpen,
    mapLanguage,
  } = useTrip();

  const [announceText, setAnnounceText] = useState<string>("");

  const isSidebarFullWidth = useIsSidebarFullWidth(sidebarOpen);
  const { mapLoaded } = useGoogleMapsScript(mapLanguage);
  const mapRef = React.useRef<HTMLDivElement>(null);

  // Initialize the map instance
  useMapInstance(
    mapRef,
    mapInstanceRef,
    mapLoaded,
    activeDay?.activities || []
  );

  // Use the centering hook
  useMapCentering({ mapInstanceRef, activities: activeDay?.activities || [] });

  // Handle activity selection with screen reader announcement
  const handleActivitySelect = (activityId: number | null) => {
    setSelectedActivity(activityId);

    if (activityId) {
      const activity = activeDay?.activities.find((a) => a.id === activityId);
      if (activity) {
        setAnnounceText(`${t("activity.activity")}: ${activity.name}`);
      }
    }
  };

  // Manage map markers and info windows
  useMapMarkers({
    mapInstanceRef,
    activities: activeDay?.activities || [],
    selectedActivity,
    hoveredActivity,
    onActivitySelect: handleActivitySelect,
    onActivityHover: setHoveredActivity,
  });

  // Draw route using OSRM
  useOSRMRoute({
    mapInstanceRef,
    activities: activeDay?.activities || [],
    enabled: mapLoaded && !!mapInstanceRef.current,
  });

  const shouldShowOverlay =
    (activeDay?.activities.length || 0) > 0 && mapLoaded && !isSidebarFullWidth;

  return (
    <main
      className="h-screen relative flex-1 transition-all duration-300"
      id="main-content"
    >
      {/* Screen reader announcements for accessibility */}
      <div className="sr-only" aria-live="polite">
        {announceText}
      </div>

      {!mapLoaded && <LoadingSpinner />}

      {/* Google Maps container */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ opacity: mapLoaded ? 1 : 0 }}
        role="application"
        aria-label={t("map.map_with_activities")}
        tabIndex={mapLoaded ? 0 : -1}
      />

      {shouldShowOverlay && (
        <ActivitiesOverlay
          activities={activeDay?.activities || []}
          selectedActivity={selectedActivity}
          onActivitySelect={handleActivitySelect}
          onActivityHover={setHoveredActivity}
        />
      )}
    </main>
  );
};

export default MapView;
