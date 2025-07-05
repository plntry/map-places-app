import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Trip, Day } from "@/types/Trip";
import { DEFAULT_LANGUAGE } from "@/constants/languages";
import {
  getWeatherAdvice,
  getWeatherForecast,
} from "../services/weatherService";
import type { WeatherAdvice, WeatherData } from "@/types/Weather";

interface TripContextType {
  // Trip data
  trip: Trip | null;
  loading: boolean;

  // Day management
  activeDay: Day | null;
  setActiveDay: (day: Day) => void;

  // Activity state
  hoveredActivity: number | null;
  selectedActivity: number | null;
  setHoveredActivity: (activityId: number | null) => void;
  setSelectedActivity: (activityId: number | null) => void;

  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Map language
  mapLanguage: string;
  setMapLanguage: (language: string) => void;

  // Weather data
  weatherData: { [dayId: number]: WeatherData };
  weatherLoading: boolean;
  getWeatherAdvice: (dayId: number) => Omit<WeatherAdvice, "message"> | null;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
}

export const TripContext = createContext<TripContextType | undefined>(
  undefined
);

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<{
    [dayId: number]: WeatherData;
  }>({});
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Initialize map language from localStorage or default
  const [mapLanguage, setMapLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mapLanguage") || DEFAULT_LANGUAGE;
    }
    return DEFAULT_LANGUAGE;
  });

  // Load weather data for a specific day
  const loadWeatherForDay = React.useCallback(
    async (day: Day) => {
      if (weatherData[day.id]) return; // Already loaded

      try {
        setWeatherLoading(true);
        // Use the first activity's coordinates for weather
        if (day.activities.length > 0) {
          const firstActivity = day.activities[0];
          const forecast = await getWeatherForecast(
            firstActivity.coords.lat,
            firstActivity.coords.lng,
            1
          );

          if (forecast.length > 0) {
            setWeatherData((prev) => ({
              ...prev,
              [day.id]: forecast[0],
            }));
          }
        }
      } catch (error) {
        console.error("Error loading weather for day:", error);
      } finally {
        setWeatherLoading(false);
      }
    },
    [weatherData]
  );

  // Load weather data when active day changes
  useEffect(() => {
    if (activeDay) {
      loadWeatherForDay(activeDay);
    }
  }, [activeDay, loadWeatherForDay]);

  // Load trip data
  useEffect(() => {
    const loadTripData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/mock-trip.${mapLanguage}.json`);
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
        setError("Failed to load trip data");
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [mapLanguage]);

  // Handle day selection
  const handleDaySelect = (day: Day) => {
    setActiveDay(day);
    setHoveredActivity(null);
    setSelectedActivity(null);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (languageCode: string) => {
    localStorage.setItem("mapLanguage", languageCode);
    setMapLanguage(languageCode);
    // Full reload to apply new language
    window.location.reload();
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get weather advice for a specific day
  const getDayWeatherAdvice = (
    dayId: number
  ): Omit<WeatherAdvice, "message"> | null => {
    const dayWeather = weatherData[dayId];
    if (!dayWeather) return null;
    return getWeatherAdvice(dayWeather);
  };

  const value: TripContextType = {
    trip,
    loading,
    activeDay,
    setActiveDay: handleDaySelect,
    hoveredActivity,
    selectedActivity,
    setHoveredActivity,
    setSelectedActivity,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    mapLanguage,
    setMapLanguage: handleLanguageChange,
    weatherData,
    weatherLoading,
    getWeatherAdvice: getDayWeatherAdvice,
    error,
    setError,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
