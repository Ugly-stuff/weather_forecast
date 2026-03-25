import { useEffect, useState } from "react";
import { getForecast } from "../services/weatherApi";
import type { ForecastData } from "../types/weather";

interface ForecastProps {
    lat: number;
    lon: number;
}

const Forecast = ({ lat, lon }: ForecastProps) => {
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForecast = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getForecast(lat, lon);
                setForecast(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch forecast"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [lat, lon]);

    const getDaysForecast = () => {
        if (!forecast) return [];

        const days: (typeof forecast.list)[number][] = [];
        const usedDates = new Set<string>();

        forecast.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toISOString().split("T")[0];

            // Get one forecast per day at noon (closest to 12:00)
            if (!usedDates.has(dateStr)) {
                const hour = date.getHours();
                if (hour >= 10 && hour <= 14) {
                    days.push(item);
                    usedDates.add(dateStr);
                }
            }
        });

        return days.slice(0, 5); // Return next 5 days
    };

    if (loading) {
        return (
            <div className="forecast-loading">
                <div className="mini-spinner"></div>
                <p>Loading forecast...</p>
            </div>
        );
    }

    if (error) {
        return <div className="forecast-error">{error}</div>;
    }

    const days = getDaysForecast();

    return (
        <div className="forecast-container">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
                {days.map((day) => {
                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                    });

                    return (
                        <div key={day.dt} className="forecast-card">
                            <p className="forecast-day">{dayName}</p>
                            <p className="forecast-temp">{Math.round(day.main.temp)}°</p>
                            <p className="forecast-weather">{day.weather[0].main}</p>
                            <p className="forecast-desc">{day.weather[0].description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
