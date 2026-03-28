import axios from "axios";
import type { WeatherData, ForecastData, CityItem, AQIData } from "../types/weather";

const API_KEY = import.meta.env.VITE_API_KEY;

export const getAQI = async (lat: number, lon: number): Promise<number> => {
    try {
        const res = await axios.get<AQIData>(
            `https://api.openweathermap.org/data/3.0/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        return res.data.list[0].main.aqi;
    } catch {
        return 0;
    }
};

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    const res = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const aqi = await getAQI(res.data.coord.lat, res.data.coord.lon);
    return { ...res.data, aqi };
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
    const res = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const aqi = await getAQI(lat, lon);
    return { ...res.data, aqi };
};

export const getForecast = async (lat: number, lon: number): Promise<ForecastData> => {
    const res = await axios.get<ForecastData>(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return res.data;
};

export const getCitySuggestions = async (query: string): Promise<CityItem[]> => {
    if (query.length < 2) return [];
    
    try {
        const res = await axios.get<CityItem[]>(
            `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        return res.data;
    } catch {
        return [];
    }
};