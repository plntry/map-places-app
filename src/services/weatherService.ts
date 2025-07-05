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

interface OpenWeatherResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    rain?: {
      "3h": number;
    };
    wind: {
      speed: number;
    };
  }>;
}

interface DailyWeatherData {
  date: string;
  temp: { min: number; max: number };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  descriptions: string[];
  icons: string[];
  count: number;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function getMostFrequent(arr: string[]): string {
  const counts: { [key: string]: number } = {};
  arr.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
}

async function makeRequest(endpoint: string): Promise<OpenWeatherResponse> {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is not configured");
  }
  const url = `${BASE_URL}${endpoint}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  return response.json();
}

function groupForecastsByDay(
  forecasts: OpenWeatherResponse["list"]
): Array<DailyWeatherData & { description: string; icon: string }> {
  const dailyData: {
    [key: string]: Omit<DailyWeatherData, "temp"> & {
      temp: { min: number; max: number };
    };
  } = {};

  forecasts.forEach((forecast) => {
    const dateObj = new Date(forecast.dt * 1000);
    const date = dateObj.toISOString().split("T")[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temp: { min: Infinity, max: -Infinity },
        humidity: 0,
        precipitation: 0,
        windSpeed: 0,
        descriptions: [],
        icons: [],
        count: 0,
      };
    }
    const day = dailyData[date];
    day.temp.min = Math.min(day.temp.min, forecast.main.temp_min);
    day.temp.max = Math.max(day.temp.max, forecast.main.temp_max);
    day.humidity += forecast.main.humidity;
    day.precipitation += forecast.rain?.["3h"] || 0;
    day.windSpeed += forecast.wind.speed;
    day.descriptions.push(forecast.weather[0].description);
    day.icons.push(forecast.weather[0].icon);
    day.count++;
  });

  return Object.values(dailyData).map((day) => ({
    ...day,
    humidity: day.humidity / day.count,
    precipitation: day.precipitation / day.count,
    windSpeed: day.windSpeed / day.count,
    description: getMostFrequent(day.descriptions),
    icon: getMostFrequent(day.icons),
  }));
}

export async function getWeatherForecast(
  lat: number,
  lng: number,
  days: number = 5
): Promise<WeatherData[]> {
  try {
    const data = await makeRequest(
      `/forecast?lat=${lat}&lon=${lng}&cnt=${days * 8}`
    );
    const dailyForecasts = groupForecastsByDay(data.list);
    return dailyForecasts.map((dayData) => ({
      date: dayData.date,
      temperature: {
        min: Math.round(dayData.temp.min),
        max: Math.round(dayData.temp.max),
      },
      description: dayData.description,
      icon: dayData.icon,
      humidity: Math.round(dayData.humidity),
      precipitation: Math.round(dayData.precipitation),
      windSpeed: Math.round(dayData.windSpeed),
    }));
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    return [];
  }
}

export function getWeatherAdvice(
  weatherData: WeatherData
): Omit<WeatherAdvice, "message"> {
  const { temperature, precipitation, description } = weatherData;
  const isRainy =
    precipitation > 5 || description.toLowerCase().includes("rain");
  const isHot = temperature.max > 30;
  const isCold = temperature.max < 10;
  const isWindy = weatherData.windSpeed > 20;

  if (isRainy) return { type: "rain", icon: "🌧️" };
  if (isHot) return { type: "heat", icon: "🌡️" };
  if (isCold) return { type: "cold", icon: "❄️" };
  if (isWindy) return { type: "wind", icon: "💨" };
  return { type: "good", icon: "☀️" };
}
