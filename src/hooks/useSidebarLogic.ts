import { useEffect, useRef, useState, useMemo } from "react";
import { useTrip } from "@/hooks/useTrip";
import { useOSRMRoute } from "@/hooks/useOSRMRoute";

interface UseSidebarLogicProps {
  mapInstanceRef: React.RefObject<google.maps.Map | null>;
}

export const useSidebarLogic = ({ mapInstanceRef }: UseSidebarLogicProps) => {
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
    setMapLanguage,
  } = useTrip();

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const enabled =
    !!activeDay &&
    (activeDay.activities?.length || 0) > 1 &&
    !!mapInstanceRef.current;

  // Get driving route info for sidebar
  const { distance, duration, loading } = useOSRMRoute({
    mapInstanceRef,
    activities: activeDay?.activities || [],
    enabled,
  });

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    setMapLanguage(languageCode);
    setShowLanguageMenu(false);
  };

  // Determine selected and hovered steps for RouteInfo
  const { selectedStep, hoveredStep } = useMemo(() => {
    let selectedStep = null;
    let hoveredStep = null;
    if (activeDay) {
      if (selectedActivity) {
        const idx = activeDay.activities.findIndex(
          (a) => a.id === selectedActivity
        );
        if (idx !== -1) selectedStep = idx + 1;
      }
      if (hoveredActivity) {
        const idx = activeDay.activities.findIndex(
          (a) => a.id === hoveredActivity
        );
        if (idx !== -1) hoveredStep = idx + 1;
      }
    }
    return { selectedStep, hoveredStep };
  }, [activeDay, selectedActivity, hoveredActivity]);

  return {
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
    showLanguageMenu,
    setShowLanguageMenu,
    languageMenuRef,
    enabled,
    distance,
    duration,
    loading,
    selectedStep,
    hoveredStep,
    handleLanguageSelect,
  };
}; 