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
  // Function to center map on all activities
  const centerOnActivities = useCallback(() => {
    if (!mapInstanceRef.current || activities.length === 0) return;

    if (activities.length === 1) {
      // Single activity - center on it with zoom
      const activity = activities[0];
      mapInstanceRef.current.setCenter({
        lat: activity.coords.lat,
        lng: activity.coords.lng,
      });
      mapInstanceRef.current.setZoom(16);
    } else {
      // Multiple activities - fit bounds
      const bounds = new window.google.maps.LatLngBounds();
      activities.forEach((activity) => {
        bounds.extend({ lat: activity.coords.lat, lng: activity.coords.lng });
      });

      // Add some padding to the bounds
      mapInstanceRef.current.fitBounds(bounds);

      // Ensure zoom level is reasonable (not too zoomed out)
      window.google.maps.event.addListenerOnce(
        mapInstanceRef.current,
        "bounds_changed",
        () => {
          if (mapInstanceRef.current!.getZoom()! > 15) {
            mapInstanceRef.current!.setZoom(15);
          }
        }
      );
    }
  }, [mapInstanceRef, activities]);

  // Center on activities when they change (new day selected)
  useEffect(() => {
    if (mapInstanceRef.current && activities.length > 0) {
      centerOnActivities();
    }
  }, [activities, centerOnActivities, mapInstanceRef]);

  return { centerOnActivities };
}
