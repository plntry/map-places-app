import { useState, useEffect } from "react";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function useGoogleMapsScript(mapLanguage: string) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // If the script for the current language is already present, do nothing
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      if (
        existingScript.getAttribute("src")?.includes(`language=${mapLanguage}`)
      ) {
        if (window.google?.maps) {
          setScriptLoaded(true);
          setMapLoaded(true);
        } else {
          existingScript.addEventListener("load", () => {
            setScriptLoaded(true);
            setMapLoaded(true);
          });
        }
        return;
      } else {
        existingScript.remove();
        // @ts-expect-error - window.google is not defined in the global scope
        if (window.google) window.google = undefined;
        window.location.reload();
        return;
      }
    }

    // Add the new script for the current language
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&language=${mapLanguage}`;
    script.async = true;

    script.onload = () => {
      setScriptLoaded(true);
      setMapLoaded(true);
    };
    script.onerror = () => console.error("Failed to load Google Maps script");

    document.head.appendChild(script);
  }, [mapLanguage]);

  return { scriptLoaded, mapLoaded };
}
