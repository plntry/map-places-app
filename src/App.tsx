import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Trip, Day } from "./types/trip";
import LoadingSpinner from "./components/LoadingSpinner";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";

function App() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Read saved language or default to 'uk'
  const [mapLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mapLanguage") || "uk";
    }
    return "uk";
  });

  // Load trip data
  useEffect(() => {
    const loadTripData = async () => {
      try {
        // Simulate network delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response = await fetch("/mock-trip.json");
        if (!response.ok) {
          throw new Error("Failed to load trip data");
        }

        const tripData: Trip = await response.json();
        setTrip(tripData);

        // Set first day as active by default
        if (tripData.days.length > 0) {
          setActiveDay(tripData.days[0]);
        }
      } catch (error) {
        console.error("Error loading trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, []);

  const handleDaySelect = (day: Day) => {
    setActiveDay(day);
    setHoveredActivity(null);
    setSelectedActivity(null);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleActivityHover = (activityId: number | null) => {
    setHoveredActivity(activityId);
  };

  const handleActivitySelect = (activityId: number | null) => {
    setSelectedActivity(activityId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLanguageChange = (languageCode: string) => {
    localStorage.setItem("mapLanguage", languageCode);
    // Full reload to apply new language
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center glass-card p-8 rounded-2xl">
          <p className="text-xl text-gray-800 mb-4">
            Помилка завантаження даних подорожі
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 glass-button-neutral text-gray-800 rounded-lg transition-all duration-300"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex relative">
      {/* Toggle Button - only show when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-[104px] left-2.5 z-50 glass-button-neutral rounded-lg shadow-lg p-3 transition-all duration-300"
          aria-label="Відкрити бічну панель"
          aria-expanded={false}
          aria-controls="sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
        </button>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth < 640 && (
        <div
          className="fixed inset-0 glass-overlay z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Unified Sidebar */}
      <div
        className={`
        relative transition-all duration-300 ease-in-out z-40
        h-screen
        ${
          sidebarOpen
            ? "w-full md:w-96 lg:w-2/5 xl:w-1/3 2xl:w-1/4 translate-x-0"
            : "w-0 lg:w-0 -translate-x-full lg:translate-x-0 overflow-hidden"
        }
      `}
        id="sidebar"
      >
        <Sidebar
          tripTitle={trip.trip_title}
          days={trip.days}
          activeDay={activeDay}
          onDaySelect={handleDaySelect}
          hoveredActivity={hoveredActivity}
          selectedActivity={selectedActivity}
          onActivityHover={handleActivityHover}
          onActivitySelect={handleActivitySelect}
          isCollapsed={!sidebarOpen}
          onToggleCollapse={toggleSidebar}
          mapLanguage={mapLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {/* Map */}
      <div className="flex-1 transition-all duration-300">
        <MapView
          activities={activeDay?.activities || []}
          selectedActivity={selectedActivity}
          onActivityHover={handleActivityHover}
          onActivitySelect={handleActivitySelect}
          mapLanguage={mapLanguage}
          hoveredActivity={hoveredActivity}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  );
}

export default App;
