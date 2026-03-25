import axios from "axios";
import type { WeatherData, ForecastData, CityItem } from "../types/weather";

const API_KEY = import.meta.env.VITE_API_KEY;

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    const res = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return res.data;
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
    const res = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return res.data;
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