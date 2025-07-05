export interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
}

export interface WeatherAdvice {
  type: "rain" | "heat" | "cold" | "wind" | "good";
  message: string;
  icon: string;
}
