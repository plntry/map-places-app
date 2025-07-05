import React from "react";
import { Cloud, Droplets, Wind } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTrip } from "@/hooks/useTrip";

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

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return iconMap[iconCode] || "🌤️";
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6">
      {/* Weather Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getWeatherIcon(dayWeather.icon)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">
              {t("weather.forecast")}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {dayWeather.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-md text-orange-600/80 font-bold">
            {dayWeather.temperature.min}° / {dayWeather.temperature.max}°
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Droplets className="w-3 h-3" />
          <span>{dayWeather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Wind className="w-3 h-3" />
          <span>{dayWeather.windSpeed} м/с</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Cloud className="w-3 h-3" />
          <span>{dayWeather.precipitation} мм</span>
        </div>
      </div>

      {/* Weather Advice */}
      {weatherAdvice && (
        <div
          className={`p-3 rounded-lg border-l-4 ${
            weatherAdvice.type === "rain"
              ? "bg-blue-50 border-blue-400"
              : weatherAdvice.type === "heat"
              ? "bg-orange-50 border-orange-400"
              : weatherAdvice.type === "cold"
              ? "bg-blue-50 border-blue-400"
              : weatherAdvice.type === "wind"
              ? "bg-yellow-50 border-yellow-400"
              : "bg-green-50 border-green-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{weatherAdvice.icon}</span>
            <span>{t(`weather.advice.${weatherAdvice.type}`)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
