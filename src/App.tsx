import { useState, useCallback } from "react";
import WeatherCard from "./components/WeatherCard";
import MapWithWeather from "./components/MapWithWeather";
import "./App.css";
import type { WeatherData } from "./types/weather";

interface MapLocation {
  lat: number;
  lon: number;
  weather: WeatherData | null;
  loading: boolean;
}

function App() {
  // Shared state for weather data
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [currentLocationWeather, setCurrentLocationWeather] = useState<WeatherData | null>(null);
  const [mapClickedLocation, setMapClickedLocation] = useState<MapLocation | null>(null);

  // Callback for when user searches for a city
  const handleCitySearch = useCallback((weatherData: WeatherData) => {
    // Center map on searched city
    setMapCenter([weatherData.coord.lat, weatherData.coord.lon]);
    // Clear previous map clicks
    setMapClickedLocation(null);
  }, []);

  // Callback for when user clicks on map
  const handleMapLocationClick = useCallback((location: MapLocation) => {
    setMapClickedLocation(location);
  }, []);

  // Callback for when current location is detected
  const handleCurrentLocation = useCallback((weather: WeatherData, position: [number, number]) => {
    setCurrentLocationWeather(weather);
    setMapCenter(position);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌤 Weather Forecast</h1>
          <p>Real time weather  Location based insights</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="content-grid">
            <section className="card-section">
              <div className="card">
                <WeatherCard 
                  onCitySearch={handleCitySearch}
                  mapClickedLocation={mapClickedLocation}
                />
              </div>
            </section>

            <section className="card-section">
              <div className="card">
                <h2>Your Location</h2>
                <MapWithWeather 
                  mapCenter={mapCenter}
                  currentLocationWeather={currentLocationWeather}
                  onCurrentLocationDetected={handleCurrentLocation}
                  onMapLocationClick={handleMapLocationClick}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Weather App • OpenWeather API</p>
      </footer>
    </div>
  );
}

export default App;