import { useCallback, useEffect } from "react";
import { Activity } from "@/types/Trip";

interface UseMapCenteringProps {
  mapInstanceRef: React.RefObject<google.maps.Map | null>;
  activities: Activity[];
}

export function useMapCentering({
  mapInstanceRef,
  activities,
}: UseMapCenteringProps) {
  const centerOnActivities = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || activities.length === 0) return;

    if (activities.length === 1) {
      // Single location – center and fixed zoom
      const { lat, lng } = activities[0].coords;
      map.setCenter({ lat, lng });
      map.setZoom(16);
    } else {
      // Multiple locations – fit bounds with padding
      const bounds = new window.google.maps.LatLngBounds();
      activities.forEach(({ coords }) => {
        bounds.extend({ lat: coords.lat, lng: coords.lng });
      });
      map.fitBounds(bounds, { top: 60, right: 40, bottom: 60, left: 40 });

      // All screens: limit excessive zoom
      window.google.maps.event.addListenerOnce(map, "bounds_changed", () => {
        const zoom = map.getZoom()!;
        const MAX_ZOOM = 15;
        if (zoom > MAX_ZOOM) map.setZoom(MAX_ZOOM);
      });

      // Mobile only: prevent zooming out too far
      if (window.innerWidth < 768) {
        window.google.maps.event.addListenerOnce(map, "idle", () => {
          const zoom = map.getZoom()!;
          const MIN_ZOOM = 15;
          if (zoom < MIN_ZOOM) map.setZoom(MIN_ZOOM);
        });
      }
    }
  }, [mapInstanceRef, activities]);

  useEffect(() => {
    centerOnActivities();
  }, [activities, centerOnActivities]);

  return { centerOnActivities };
}
