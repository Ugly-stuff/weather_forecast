import { useState } from "react";
import { getWeatherByCity, getCitySuggestions } from "../services/weatherApi";
import type { WeatherData, CityItem } from "../types/weather.ts"
import Forecast from "./Forecast";
import WeatherInsights from "./WeatherInsights";

interface MapLocation {
  lat: number;
  lon: number;
  weather: WeatherData | null;
  loading: boolean;
}

interface WeatherCardProps {
  onCitySearch?: (weatherData: WeatherData) => void;
  mapClickedLocation?: MapLocation | null;
}

const WeatherCard = ({ onCitySearch, mapClickedLocation }: WeatherCardProps) => {
  const [city, setCity] = useState<string>("");
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CityItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (value: string) => {
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const results = await getCitySuggestions(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  };

  const fetchWeather = async (cityName?: string) => {
    const searchCity = cityName || city;

    if (!searchCity.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    setShowSuggestions(false);
    
    try {
      const res = await getWeatherByCity(searchCity);
      setData(res);
      setCity("");
      onCitySearch?.(res);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch weather";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: CityItem) => {
    const cityName = suggestion.state 
      ? `${suggestion.name}, ${suggestion.state}`
      : `${suggestion.name}, ${suggestion.country || ""}`.trim();
    
    fetchWeather(cityName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  // Determine which data to display - prefer searched data, then map clicked
  const displayData = data || mapClickedLocation?.weather;
  const isMapClicked = !data && mapClickedLocation?.weather;

  return (
    <div className="weather-card">
      <div className="search-section">
        <h2>📍 Search Weather by City</h2>
        <div className="input-group">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={city}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => city.length >= 2 && setShowSuggestions(true)}
              placeholder="Enter city name (e.g., London, Tokyo)"
              disabled={loading}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-item"
                  >
                    <span className="suggestion-name">{suggestion.name}</span>
                    {suggestion.state && (
                      <span className="suggestion-state">{suggestion.state}</span>
                    )}
                    <span className="suggestion-country">
                      {suggestion.country}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => fetchWeather()}
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {displayData && (
        <div className="weather-result">
          <div className="location-header">
            {isMapClicked && <p style={{ fontSize: "0.9em", color: "#667eea", marginBottom: "10px" }}>📌 From Map Click</p>}
            <h2>{displayData.name}, {displayData.sys.country}</h2>
            <p className="weather-main">{displayData.weather[0].main}</p>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <span className="label">Temperature</span>
              <span className="value">{Math.round(displayData.main.temp)}°C</span>
            </div>
            <div className="detail-item">
              <span className="label">Feels Like</span>
              <span className="value">{Math.round(displayData.main.feels_like)}°C</span>
            </div>
            <div className="detail-item">
              <span className="label">Humidity</span>
              <span className="value">{displayData.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="label">Wind Speed</span>
              <span className="value">{displayData.wind.speed.toFixed(1)} m/s</span>
            </div>
            <div className="detail-item">
              <span className="label">Pressure</span>
              <span className="value">{displayData.main.pressure} hPa</span>
            </div>
            <div className="detail-item">
              <span className="label">Visibility</span>
              <span className="value">{(displayData.visibility / 1000).toFixed(1)} km</span>
            </div>
            <div className="detail-item">
              <span className="label">Sunrise</span>
              <span className="value">{new Date(displayData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
            <div className="detail-item">
              <span className="label">Sunset</span>
              <span className="value">{new Date(displayData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
          </div>

          <div className="description">
            <p>{displayData.weather[0].description}</p>
          </div>

          <WeatherInsights weather={displayData} />

          {displayData.coord && (
            <Forecast lat={displayData.coord.lat} lon={displayData.coord.lon} />
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;