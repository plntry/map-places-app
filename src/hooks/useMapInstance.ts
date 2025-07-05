import { useEffect } from "react";

export function useMapInstance(
  mapRef: React.MutableRefObject<HTMLDivElement | null>,
  mapInstanceRef: React.MutableRefObject<google.maps.Map | null>,
  mapLoaded: boolean,
  activities: { coords: { lat: number; lng: number } }[]
) {
  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
      let center = { lat: 41.9028, lng: 12.4964 }; // Default (Rome)
      if (activities.length > 0) {
        // Compute average center of activities
        const avg = activities.reduce(
          (acc, a) => ({
            lat: acc.lat + a.coords.lat / activities.length,
            lng: acc.lng + a.coords.lng / activities.length,
          }),
          { lat: 0, lng: 0 }
        );
        center = avg;
      }
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
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
  }, [mapLoaded, mapRef, mapInstanceRef, activities]);
}
