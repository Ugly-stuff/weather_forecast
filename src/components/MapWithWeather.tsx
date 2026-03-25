import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";
import type { WeatherData } from "../types/weather";
import Forecast from "./Forecast";

const API_KEY = import.meta.env.VITE_API_KEY;

interface MapLocation {
    lat: number;
    lon: number;
    weather: WeatherData | null;
    loading: boolean;
}

const MapClickHandler = ({
    onLocationClick,
}: {
    onLocationClick: (lat: number, lon: number) => void;
}) => {
    useMapEvents({
        click: (e) => {
            onLocationClick(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
};

const MapWithWeather = () => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [clickedLocation, setClickedLocation] = useState<MapLocation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;

                    setPosition([lat, lon]);

                    if (!API_KEY) {
                        setError("API key not configured");
                        setLoading(false);
                        return;
                    }

                    // weather fetch by lat lon
                    const res = await axios.get<WeatherData>(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                    );

                    setWeather(res.data);
                    setError(null);
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch weather data"
                    );
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError(
                    err.code === err.PERMISSION_DENIED
                        ? "Location permission denied"
                        : "Failed to get your location"
                );
                setLoading(false);
            }
        );
    }, []);

    const handleMapClick = async (lat: number, lon: number) => {
        setClickedLocation({
            lat,
            lon,
            weather: null,
            loading: true,
        });

        try {
            if (!API_KEY) {
                setError("API key not configured");
                return;
            }

            const res = await axios.get<WeatherData>(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );

            setClickedLocation({
                lat,
                lon,
                weather: res.data,
                loading: false,
            });
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch weather for this location"
            );
            setClickedLocation({
                lat,
                lon,
                weather: null,
                loading: false,
            });
        }
    };

    if (loading)
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>Loading your location...</p>
            </div>
        );

    if (error)
        return (
            <div className="map-error">
                <p>⚠️ {error}</p>
            </div>
        );

    if (!position)
        return (
            <div className="map-error">
                <p>Unable to determine your location</p>
            </div>
        );

    return (
        <div className="map-with-weather">
            <MapContainer
                center={position}
                zoom={10}
                style={{ height: "400px", width: "100%", borderRadius: "12px" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MapClickHandler onLocationClick={handleMapClick} />

                {/* Current location marker */}
                <Marker position={position}>
                    <Popup>
                        {weather ? (
                            <div className="map-popup">
                                <h3>📍 {weather.name}</h3>
                                <p className="temp">{Math.round(weather.main.temp)}°C</p>
                                <p className="weather-desc">{weather.weather[0].description}</p>
                                <p className="humidity">💧 Humidity: {weather.main.humidity}%</p>
                                <p className="wind">💨 Wind: {weather.wind.speed.toFixed(1)} m/s</p>
                            </div>
                        ) : (
                            <p>Loading weather...</p>
                        )}
                    </Popup>
                </Marker>

                {/* Clicked location marker */}
                {clickedLocation && (
                    <Marker position={[clickedLocation.lat, clickedLocation.lon]}>
                        <Popup>
                            {clickedLocation.loading ? (
                                <div className="map-popup-loading">
                                    <div className="mini-spinner"></div>
                                    <p>Fetching weather...</p>
                                </div>
                            ) : clickedLocation.weather ? (
                                <div className="map-popup">
                                    <h3>📍 {clickedLocation.weather.name}</h3>
                                    <p className="temp">
                                        {Math.round(clickedLocation.weather.main.temp)}°C
                                    </p>
                                    <p className="weather-desc">
                                        {clickedLocation.weather.weather[0].description}
                                    </p>
                                    <p className="humidity">
                                        💧 Humidity: {clickedLocation.weather.main.humidity}%
                                    </p>
                                    <p className="wind">
                                        💨 Wind:{" "}
                                        {clickedLocation.weather.wind.speed.toFixed(1)} m/s
                                    </p>
                                </div>
                            ) : (
                                <p>Failed to fetch weather</p>
                            )}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Current location weather details */}
            {weather && (
                <div className="current-location-weather">
                    <h3>Current Location Weather</h3>
                    <div className="location-info">
                        <div className="info-item">
                            <span className="label">Location</span>
                            <span className="value">{weather.name}, {weather.sys.country}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Temperature</span>
                            <span className="value">{Math.round(weather.main.temp)}°C</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Condition</span>
                            <span className="value">{weather.weather[0].main}</span>
                        </div>
                    </div>
                    <Forecast lat={weather.coord.lat} lon={weather.coord.lon} />
                </div>
            )}

            {/* Clicked location weather details */}
            {clickedLocation?.weather && (
                <div className="clicked-location-weather">
                    <h3>Clicked Location Weather</h3>
                    <div className="location-info">
                        <div className="info-item">
                            <span className="label">Location</span>
                            <span className="value">
                                {clickedLocation.weather.name}, {clickedLocation.weather.sys.country}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Temperature</span>
                            <span className="value">
                                {Math.round(clickedLocation.weather.main.temp)}°C
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Condition</span>
                            <span className="value">{clickedLocation.weather.weather[0].main}</span>
                        </div>
                    </div>
                    <Forecast 
                        lat={clickedLocation.weather.coord.lat} 
                        lon={clickedLocation.weather.coord.lon} 
                    />
                </div>
            )}
        </div>
    );
};

export default MapWithWeather;