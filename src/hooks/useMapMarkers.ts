import { useEffect, useRef } from "react";
import { Activity } from "@/types/Trip";
import { UseMapMarkersProps } from "@/types/Map";

export function useMapMarkers({
  mapInstanceRef,
  activities,
  selectedActivity,
  hoveredActivity,
  onActivitySelect,
  onActivityHover,
}: UseMapMarkersProps) {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const activitiesRef = useRef<Activity[]>([]);

  // Create markers and info windows
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    const activitiesChanged =
      JSON.stringify(activities) !== JSON.stringify(activitiesRef.current);
    if (!activitiesChanged && markersRef.current.length > 0) return;

    // Clear previous markers/windows
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current = [];

    activities.forEach((activity: Activity, index: number) => {
      const marker = new window.google.maps.Marker({
        position: { lat: activity.coords.lat, lng: activity.coords.lng },
        map: mapInstanceRef.current!,
        title: activity.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="white" stroke-width="3"/>
                <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${
                  index + 1
                }</text>
              </svg>
            `)}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 0px 12px 8px; max-width: 250px; margin: 0; line-height: 1.4;">
            <h3 style="font-weight: 600; color: #1f2937; margin: 0 0 4px 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${activity.name}</h3>
            <p style="font-size: 12px; color: #6b7280; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${activity.description}</p>
          </div>
        `,
        pixelOffset: new window.google.maps.Size(0, -10),
      });

      marker.addListener("click", () => {
        infoWindow.open({ anchor: marker, map: mapInstanceRef.current! });
        onActivitySelect(activity.id);
      });
      marker.addListener("mouseover", () => onActivityHover(activity.id));
      marker.addListener("mouseout", () => onActivityHover(null));

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });

    activitiesRef.current = [...activities];
  }, [mapInstanceRef, activities, onActivitySelect, onActivityHover]);

  // Update marker icons on selection/hover
  useEffect(() => {
    if (!mapInstanceRef.current || markersRef.current.length === 0) return;
    markersRef.current.forEach((marker, index) => {
      const activity = activities[index];
      if (activity) {
        const isHighlighted =
          selectedActivity === activity.id || hoveredActivity === activity.id;
        marker.setIcon({
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="${
                isHighlighted ? "#f97316" : "#3b82f6"
              }" stroke="white" stroke-width="${
            selectedActivity === activity.id ? "4" : "3"
          }"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${
                index + 1
              }</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        });
      }
    });
  }, [selectedActivity, hoveredActivity, activities, mapInstanceRef]);

  // Center map on selected activity and open info window
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedActivity) return;
    const sel = activities.find((a: Activity) => a.id === selectedActivity);
    if (!sel) return;
    const center = { lat: sel.coords.lat, lng: sel.coords.lng };
    mapInstanceRef.current.panTo(center);
    mapInstanceRef.current.setZoom(16);
    infoWindowsRef.current.forEach((iw, idx) => {
      if (activities[idx].id === selectedActivity) {
        iw.open({
          anchor: markersRef.current[idx],
          map: mapInstanceRef.current!,
        });
      } else {
        iw.close();
      }
    });
  }, [selectedActivity, activities, mapInstanceRef]);

  return { markersRef, infoWindowsRef };
}
