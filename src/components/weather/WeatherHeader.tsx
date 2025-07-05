import React from "react";

interface WeatherHeaderProps {
  icon: string;
  description: string;
  minTemp: number;
  maxTemp: number;
  t: (key: string) => string;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  icon,
  description,
  minTemp,
  maxTemp,
  t,
}) => (
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-gray-800">{t("weather.forecast")}</h3>
        <p className="text-sm text-gray-600 capitalize">{description}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-md text-orange-600/80 font-bold">
        {minTemp}° / {maxTemp}°
      </div>
    </div>
  </div>
);

export default WeatherHeader;
