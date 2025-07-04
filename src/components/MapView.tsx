import React, { useEffect, useRef, useState } from "react";
import { Activity } from "../types/trip";

// Hook to detect if sidebar is full width (mobile/small screen)
function useIsSidebarFullWidth(sidebarOpen: boolean) {
  const [isFull, setIsFull] = useState(false);
  useEffect(() => {
    function check() {
      setIsFull(sidebarOpen && window.innerWidth < 768);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [sidebarOpen]);
  return isFull;
}

interface MapViewProps {
  activities: Activity[];
  selectedActivity: number | null;
  onActivityHover: (activityId: number | null) => void;
  onActivitySelect: (activityId: number | null) => void;
  mapLanguage: string;
  hoveredActivity: number | null;
  sidebarOpen?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  activities,
  selectedActivity,
  onActivityHover,
  onActivitySelect,
  mapLanguage,
  hoveredActivity,
  sidebarOpen = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const activitiesRef = useRef<Activity[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const [announceText, setAnnounceText] = useState<string>("");
  const isSidebarFullWidth = useIsSidebarFullWidth(sidebarOpen);

  // Load Google Maps script only once with chosen language
  useEffect(() => {
    if (!mapRef.current) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBsKdN4dwUx5RjFdqTPaSEStxqaCQR7qck&libraries=marker&language=${mapLanguage}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setScriptLoaded(true);
      setMapLoaded(true);
    };
    script.onerror = () => console.error("Failed to load Google Maps script");

    document.head.appendChild(script);
    return () => {
      // cleanup script if unmount
      document.getElementById("google-maps-script")?.remove();
    };
  }, [mapLanguage]);

  // Initialize map when script is loaded and activities change
  useEffect(() => {
    if (
      !scriptLoaded ||
      !mapRef.current ||
      !window.google?.maps ||
      typeof window.google.maps.Map !== "function"
    ) {
      return;
    }

    const activitiesChanged =
      JSON.stringify(activities) !== JSON.stringify(activitiesRef.current);

    if (!activitiesChanged && mapInstanceRef.current) return;

    // Clear previous markers/windows
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current = [];

    // Initialize or re-init map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 41.9028, lng: 12.4964 },
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    }

    // Add markers for active day's activities
    activities.forEach((activity, index) => {
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
        setAnnounceText(`Вибрано активність: ${activity.name}`);
      });
      marker.addListener("mouseover", () => onActivityHover(activity.id));
      marker.addListener("mouseout", () => onActivityHover(null));

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });

    activitiesRef.current = [...activities];
  }, [scriptLoaded, activities, onActivitySelect, onActivityHover]);

  // Center map on selected activity
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedActivity) return;

    const sel = activities.find((a) => a.id === selectedActivity);
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
  }, [selectedActivity, activities]);

  // Add this useEffect after your marker creation useEffect
  useEffect(() => {
    if (!scriptLoaded || markersRef.current.length === 0) return;

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
  }, [selectedActivity, hoveredActivity, activities, scriptLoaded]);

  return (
    <main className="h-screen relative" id="main-content">
      <div className="sr-only" aria-live="polite">
        {announceText}
      </div>

      {!mapLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          role="status"
          aria-label="Завантаження карти"
        >
          <div className="text-center glass-card p-6 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white mx-auto mb-3"></div>
            <p className="text-sm text-white">Завантаження карти...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ opacity: mapLoaded ? 1 : 0 }}
        role="application"
        aria-label="Карта Google з позначками активностей"
        tabIndex={mapLoaded ? 0 : -1}
      />

      {/* Map Info Overlay - Responsive positioning */}
      {activities.length > 0 && mapLoaded && !isSidebarFullWidth && (
        <aside
          className="absolute bottom-4 left-4 glass-card rounded-xl p-3 sm:p-4 max-w-xs sm:max-w-sm z-10"
          role="complementary"
          aria-labelledby="map-activities-heading"
        >
          <h3
            className="font-semibold mb-2 text-sm sm:text-base"
            id="map-activities-heading"
          >
            Активності на карті
          </h3>
          <ul className="space-y-2" role="list">
            {activities.map((activity, index) => (
              <li
                key={activity.id}
                className={`flex items-center gap-2 text-xs sm:text-sm transition-colors duration-200 cursor-pointer !min-h-0 !min-w-0 ${
                  selectedActivity === activity.id
                    ? "text-orange-600 font-medium"
                    : "text-gray-700"
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Активність ${index + 1}: ${activity.name}`}
                aria-pressed={selectedActivity === activity.id}
                onClick={() => onActivitySelect(activity.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onActivitySelect(activity.id);
                  }
                }}
                onMouseEnter={() => onActivityHover(activity.id)}
                onMouseLeave={() => onActivityHover(null)}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 border-2 ${
                    selectedActivity === activity.id
                      ? "bg-orange-500 border-orange-600"
                      : "bg-blue-500 border-blue-600"
                  } ${
                    selectedActivity === activity.id ? "border-orange-700" : ""
                  }`}
                  aria-hidden="true"
                >
                  {index + 1}
                </div>
                <span className="truncate">{activity.name}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
};

export default MapView;
