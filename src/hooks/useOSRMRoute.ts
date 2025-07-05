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
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear any existing polyline immediately
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // If disabled or too few points, reset and skip
    if (!enabled || activities.length < 2) {
      setDistance(null);
      setDuration(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setDistance(null);
    setDuration(null);

    // Build coordinate string for OSRM
    const coordString = activities
      .map((a) => `${a.coords.lng},${a.coords.lat}`)
      .join(";");
    const url =
      `https://router.project-osrm.org/route/v1/driving/${coordString}` +
      `?overview=full&geometries=geojson&alternatives=false`;

    // Use AbortController to cancel stale requests
    const controller = new AbortController();
    const { signal } = controller;

    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`OSRM fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (signal.aborted) return;
        const route = data.routes?.[0];
        if (!route) {
          throw new Error("No route available");
        }

        setDistance(route.distance / 1000);
        setDuration(route.duration);

        const path = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({ lat, lng })
        );

        const polyline = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: "#3b82f6",
          strokeOpacity: 0.8,
          strokeWeight: 4,
        });
        polyline.setMap(map);
        polylineRef.current = polyline;
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("OSRM routing error:", err);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => {
      // Cancel ongoing fetch
      controller.abort();
      // Remove polyline on cleanup
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [activities, mapInstanceRef, enabled]);

  return { distance, duration, loading };
}
