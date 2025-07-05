import React from "react";
import { Cloud } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WeatherHeader, WeatherDetails, WeatherAdvice } from "./components";
import { useTrip } from "@/hooks/useTrip";
import { getWeatherIcon } from "@/utils/weather";

const WeatherCard: React.FC = () => {
  const { t } = useTranslation();
  const { activeDay, weatherData, weatherLoading, getWeatherAdvice } =
    useTrip();

  if (!activeDay) return null;

  const dayWeather = weatherData[activeDay.id];
  const weatherAdvice = getWeatherAdvice(activeDay.id);

  if (weatherLoading) {
    return (
      <div className="glass-card rounded-xl p-4 mb-6 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!dayWeather) {
    return (
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Cloud className="w-4 h-4" />
          <span className="text-sm">{t("weather.unavailable")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-neutral rounded-xl p-4 mb-6">
      <WeatherHeader
        icon={getWeatherIcon(dayWeather.icon)}
        description={dayWeather.description}
        minTemp={dayWeather.temperature.min}
        maxTemp={dayWeather.temperature.max}
        t={t}
      />
      <WeatherDetails
        humidity={dayWeather.humidity}
        windSpeed={dayWeather.windSpeed}
        precipitation={dayWeather.precipitation}
      />
      {weatherAdvice && <WeatherAdvice advice={weatherAdvice} t={t} />}
    </div>
  );
};

export default WeatherCard;
