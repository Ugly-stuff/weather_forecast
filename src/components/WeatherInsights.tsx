import type { WeatherData } from "../types/weather";

interface WeatherInsightsProps {
    weather: WeatherData;
}

const WeatherInsights = ({ weather }: WeatherInsightsProps) => {
    const getComfortLevel = (temp: number) => {
        if (temp < 0) return { level: "Freezing", color: "#3b82f6", emoji: "❄️" };
        if (temp < 10) return { level: "Cold", color: "#0ea5e9", emoji: "🧊" };
        if (temp < 20) return { level: "Cool", color: "#06b6d4", emoji: "😌" };
        if (temp < 25) return { level: "Comfortable", color: "#10b981", emoji: "☀️" };
        if (temp < 30) return { level: "Warm", color: "#f59e0b", emoji: "🌞" };
        return { level: "Hot", color: "#ef4444", emoji: "🔥" };
    };

    const getHumidityLevel = (humidity: number) => {
        if (humidity < 30) return { level: "Dry", recommendation: "Use moisturizer", emoji: "🏜️" };
        if (humidity < 50) return { level: "Comfortable", recommendation: "Perfect humidity", emoji: "👍" };
        if (humidity < 70) return { level: "Moderate", recommendation: "Slightly humid", emoji: "💧" };
        return { level: "High", recommendation: "Very humid, stay hydrated", emoji: "💦" };
    };

    const getWindCondition = (speed: number) => {
        if (speed < 5) return { level: "Calm", emoji: "😌", activity: "Perfect for outdoor activities" };
        if (speed < 10) return { level: "Light breeze", emoji: "🌬️", activity: "Good for most activities" };
        if (speed < 15) return { level: "Moderate wind", emoji: "💨", activity: "Be cautious with umbrellas" };
        if (speed < 20) return { level: "Strong wind", emoji: "🌪️", activity: "Stay indoors if possible" };
        return { level: "Very strong wind", emoji: "⛈️", activity: "Dangerous, avoid outdoor activities" };
    };

    const getVisibilityLevel = (visibility: number) => {
        const km = visibility / 1000;
        if (km >= 10) return { level: "Excellent", emoji: "👁️" };
        if (km >= 5) return { level: "Good", emoji: "👀" };
        if (km >= 1) return { level: "Moderate", emoji: "🌫️" };
        return { level: "Poor", emoji: "🌫️🌫️" };
    };

    const getCloudCover = (clouds: number) => {
        if (clouds < 20) return { level: "Clear", emoji: "☀️" };
        if (clouds < 50) return { level: "Partly Cloudy", emoji: "⛅" };
        if (clouds < 80) return { level: "Mostly Cloudy", emoji: "☁️" };
        return { level: "Overcast", emoji: "🌥️" };
    };

    const comfort = getComfortLevel(weather.main.temp);
    const humidity = getHumidityLevel(weather.main.humidity);
    const wind = getWindCondition(weather.wind.speed);
    const visibility = getVisibilityLevel(weather.visibility);
    const clouds = getCloudCover(weather.clouds.all);

    return (
        <div className="weather-insights">
            <h3>🧠 Weather Insights & Recommendations</h3>

            <div className="insights-grid">
                {/* Temperature Comfort */}
                <div className="insight-card">
                    <div className="insight-header">
                        <span className="insight-emoji">{comfort.emoji}</span>
                        <h4>Temperature</h4>
                    </div>
                    <div className="insight-body">
                        <p className="insight-value">{Math.round(weather.main.temp)}°C</p>
                        <p className="insight-label">{comfort.level}</p>
                        <p className="insight-detail">Feels like {Math.round(weather.main.feels_like)}°C</p>
                        {weather.main.temp > 30 && (
                            <p className="insight-recommendation">💡 Stay hydrated and use sunscreen</p>
                        )}
                        {weather.main.temp < 0 && (
                            <p className="insight-recommendation">💡 Wear winter clothing and be careful of icy surfaces</p>
                        )}
                    </div>
                </div>

                {/* Humidity Level */}
                <div className="insight-card">
                    <div className="insight-header">
                        <span className="insight-emoji">{humidity.emoji}</span>
                        <h4>Humidity</h4>
                    </div>
                    <div className="insight-body">
                        <p className="insight-value">{weather.main.humidity}%</p>
                        <p className="insight-label">{humidity.level}</p>
                        <p className="insight-recommendation">💡 {humidity.recommendation}</p>
                    </div>
                </div>

                {/* Wind Condition */}
                <div className="insight-card">
                    <div className="insight-header">
                        <span className="insight-emoji">{wind.emoji}</span>
                        <h4>Wind</h4>
                    </div>
                    <div className="insight-body">
                        <p className="insight-value">
                            {weather?.wind?.speed !== undefined
                                ? weather.wind.speed.toFixed(1)
                                : "N/A"} m/s
                        </p>
                        <p className="insight-label">{wind.level}</p>
                        <p className="insight-recommendation">💡 {wind.activity}</p>
                    </div>
                </div>

                {/* Visibility */}
                <div className="insight-card">
                    <div className="insight-header">
                        <span className="insight-emoji">{visibility.emoji}</span>
                        <h4>Visibility</h4>
                    </div>
                    <div className="insight-body">
                        <p className="insight-value">{(weather.visibility / 1000).toFixed(1)} km</p>
                        <p className="insight-label">{visibility.level}</p>
                        {weather.visibility < 1000 && (
                            <p className="insight-recommendation">💡 Reduce speed while driving</p>
                        )}
                    </div>
                </div>

                {/* Cloud Cover */}
                <div className="insight-card">
                    <div className="insight-header">
                        <span className="insight-emoji">{clouds.emoji}</span>
                        <h4>Cloud Cover</h4>
                    </div>
                    <div className="insight-body">
                        <p className="insight-value">{weather.clouds.all}%</p>
                        <p className="insight-label">{clouds.level}</p>
                        {weather.clouds.all < 30 && (
                            <p className="insight-recommendation">💡 Great day for outdoor activities!</p>
                        )}
                    </div>
                </div>

                {/* Pressure */}
                <div className="insight-card">
                    <div className="insight-header">
                        <span className="insight-emoji">🌡️</span>
                        <h4>Pressure</h4>
                    </div>
                    <div className="insight-body">
                        <p className="insight-value">{weather.main.pressure} hPa</p>
                        <p className="insight-label">
                            {weather.main.pressure > 1020 ? "High Pressure" : weather.main.pressure < 1000 ? "Low Pressure" : "Normal"}
                        </p>
                        {weather.main.pressure < 1000 && (
                            <p className="insight-recommendation">💡 Weather may worsen soon</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Recommendations */}
            <div className="insights-summary">
                <h4>📋 Summary</h4>
                <div className="summary-items">
                    {weather.main.temp > 25 && weather.clouds.all < 30 ? (
                        <p>✅ Perfect day for outdoor activities - sunny and warm!</p>
                    ) : null}
                    {weather.wind.speed > 15 ? (
                        <p>⚠️ Strong winds - secure loose objects and be cautious outdoors</p>
                    ) : null}
                    {weather.visibility < 1000 ? (
                        <p>⚠️ Low visibility - exercise caution while driving</p>
                    ) : null}
                    {weather.main.humidity > 80 && weather.main.temp > 25 ? (
                        <p>☀️ Hot and humid - drink plenty of water and take breaks</p>
                    ) : null}
                    {weather.main.temp > 0 && weather.main.temp < 20 && (
                        <p>Cool weather</p>
                    )}
                    {weather.weather[0].main === "Rain" || weather.weather[0].main === "Rainy" ? (
                        <p>☔ Rain expected - carry an umbrella and watch for puddles</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default WeatherInsights;
