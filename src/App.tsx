import React from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "@/components/LoadingSpinner";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import { ToggleButton } from "@/components/sidebarComps";
import { ErrorPage } from "@/components/ErrorPage";
import { TripProvider } from "@/contexts/TripContext";
import { useTrip } from "@/hooks/useTrip";

// Main app content component that uses the context
const AppContent: React.FC = () => {
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

      <Sidebar />

      <MapView />
    </div>
  );
};

function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}

export default App;
