import React from "react";

interface WeatherAdviceProps {
  advice: { type: string; icon: string };
  t: (key: string) => string;
}

const WeatherAdvice: React.FC<WeatherAdviceProps> = ({ advice, t }) => {
  if (!advice) return null;
  const type = advice.type;
  return (
    <div
      className={`p-3 rounded-lg border-l-4 ${
        type === "rain"
          ? "bg-blue-50 border-blue-400"
          : type === "heat"
          ? "bg-orange-50 border-orange-400"
          : type === "cold"
          ? "bg-blue-50 border-blue-400"
          : type === "wind"
          ? "bg-yellow-50 border-yellow-400"
          : "bg-green-50 border-green-400"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{advice.icon}</span>
        <span>{t(`weather.advice.${type}`)}</span>
      </div>
    </div>
  );
};

export default WeatherAdvice;
