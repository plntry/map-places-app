import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "@/components/LoadingSpinner";
import Sidebar from "@/components/sidebar/index.tsx";
import MapView from "@/components/map";
import ToggleButton from "@/components/sidebar/ToggleButton";
import { ErrorPage } from "@/components/ErrorPage";
import { TripProvider } from "@/contexts/TripContext";
import { useTrip } from "@/hooks/useTrip";
import { MapInstanceContext } from "@/contexts/MapInstanceContext";

// Main app content component that uses the context
const AppContent: React.FC<{
  mapInstanceRef: React.RefObject<google.maps.Map | null>;
}> = ({ mapInstanceRef }) => {
  const { t } = useTranslation();
  const { trip, loading, sidebarOpen, toggleSidebar, error } = useTrip();

  if (loading) {
    return <LoadingSpinner message={t("loading.preparing_trip")} />;
  }

  if (error || !trip) {
    return (
      <ErrorPage
        message={t("error.loading_trip")}
        buttonText={t("actions.try_again")}
        buttonOnClick={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="h-screen flex relative">
      {/* Open Sidebar Button */}
      {!sidebarOpen && (
        <ToggleButton
          variant="open"
          onClick={toggleSidebar}
          ariaControls="sidebar"
          ariaExpanded={false}
        />
      )}

      <Sidebar mapInstanceRef={mapInstanceRef} />
      <MapView mapInstanceRef={mapInstanceRef} />
    </div>
  );
};

function App() {
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  return (
    <TripProvider>
      <MapInstanceContext.Provider value={mapInstanceRef}>
        <AppContent mapInstanceRef={mapInstanceRef} />
      </MapInstanceContext.Provider>
    </TripProvider>
  );
}

export default App;
