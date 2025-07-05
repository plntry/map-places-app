import { useEffect, useRef, useState } from "react";
import { Activity } from "@/types/Trip";

interface UseOSRMRouteProps {
  mapInstanceRef: React.RefObject<google.maps.Map | null>;
  activities: Activity[];
  enabled?: boolean;
}

export function useOSRMRoute({
  mapInstanceRef,
  activities,
  enabled = true,
}: UseOSRMRouteProps) {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Always remove previous polyline first
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (!enabled || !mapInstanceRef.current || activities.length < 2) return;

    setLoading(true);
    setDistance(null);
    setDuration(null);

    // Build OSRM coordinate string
    const coordString = activities
      .map((a) => `${a.coords.lng},${a.coords.lat}`)
      .join(";");

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson&alternatives=true`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data.routes?.length) {
          setLoading(false);
          return;
        }

        const route = data.routes[0];
        const path = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({ lat, lng })
        );
        setDistance(route.distance / 1000); // km
        setDuration(route.duration); // seconds

        // Draw polyline
        const routeLine = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: "#3b82f6",
          strokeOpacity: 0.8,
          strokeWeight: 4,
        });
        routeLine.setMap(mapInstanceRef.current!);
        polylineRef.current = routeLine;
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("OSRM routing error:", err);
      });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [activities, mapInstanceRef, enabled]);

  return { distance, duration, loading };
}
