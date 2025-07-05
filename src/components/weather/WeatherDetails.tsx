import React from "react";
import { Droplets, Wind, Cloud } from "lucide-react";

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  humidity,
  windSpeed,
  precipitation,
}) => (
  <div className="grid grid-cols-3 gap-3 mb-3">
    <div className="flex items-center gap-1 text-xs text-gray-600">
      <Droplets className="w-3 h-3" />
      <span>{humidity}%</span>
    </div>
    <div className="flex items-center gap-1 text-xs text-gray-600">
      <Wind className="w-3 h-3" />
      <span>{windSpeed} м/с</span>
    </div>
    <div className="flex items-center gap-1 text-xs text-gray-600">
      <Cloud className="w-3 h-3" />
      <span>{precipitation} мм</span>
    </div>
  </div>
);

export default WeatherDetails;
