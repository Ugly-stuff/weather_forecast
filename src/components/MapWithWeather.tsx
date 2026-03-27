import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import { useMap } from "react-leaflet";
import axios from "axios";
import type { WeatherData } from "../types/weather";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const API_KEY = import.meta.env.VITE_API_KEY;

interface MapLocation {
    lat: number;
    lon: number;
    weather: WeatherData | null;
    loading: boolean;
}

interface MapWithWeatherProps {
    mapCenter: [number, number] | null;
    currentLocationWeather: WeatherData | null;
    onCurrentLocationDetected: (weather: WeatherData, position: [number, number]) => void;
    onMapLocationClick: (location: MapLocation) => void;
}

// Component to handle map center updates
const MapCenterChanger = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

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

const MapWithWeather = ({
    mapCenter,
    currentLocationWeather,
    onCurrentLocationDetected,
    onMapLocationClick,
}: MapWithWeatherProps) => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<any>(null);

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

                    onCurrentLocationDetected(res.data, [lat, lon]);
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
    }, [onCurrentLocationDetected]);

    const handleMapClick = async (lat: number, lon: number) => {
        onMapLocationClick({
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

            onMapLocationClick({
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
            onMapLocationClick({
                lat,
                lon,
                weather: null,
                loading: false,
            });
        }
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
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

                    const res = await axios.get<WeatherData>(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                    );

                    onCurrentLocationDetected(res.data, [lat, lon]);
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
    };

    if (loading)
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>📍 Detecting your location...</p>
                <small>Please allow location access in your browser</small>
            </div>
        );

    if (error)
        return (
            <div className="map-error">
                <p>⚠️ {error}</p>
                <small>You can still search for cities above</small>
            </div>
        );

    if (!position)
        return (
            <div className="map-error">
                <p>❌ Unable to determine your location</p>
                <small>Try searching for a specific city instead</small>
            </div>
        );

    return (
        <div className="map-with-weather">
            <div style={{ position: "relative" }}>
                <MapContainer
                    ref={mapRef}
                    center={position}
                    zoom={10}
                    style={{ height: "450px", width: "100%", borderRadius: "12px" }}
                >
                    <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <MapClickHandler onLocationClick={handleMapClick} />
                    
                    {/* Update map center when mapCenter prop changes */}
                    <MapCenterChanger center={mapCenter} />

                    {/* Current location circle indicator */}
                    <Circle center={position} radius={5000} pathOptions={{ color: "rgba(102, 126, 234, 0.3)", fill: true }} />

                    {/* Current location marker */}
                    <Marker position={position}>
                        <Popup>
                            {currentLocationWeather ? (
                                <div className="map-popup">
                                    <h3>📍 Your Location: {currentLocationWeather.name}</h3>
                                    <p className="temp">{Math.round(currentLocationWeather.main.temp)}°C</p>
                                    <p className="weather-desc">{currentLocationWeather.weather[0].description}</p>
                                    <div className="popup-details">
                                        <p className="humidity">💧 Humidity: {currentLocationWeather.main.humidity}%</p>
                                        <p className="wind">💨 Wind: {currentLocationWeather.wind.speed.toFixed(1)} m/s</p>
                                        <p className="pressure">🌡️ Pressure: {currentLocationWeather.main.pressure} hPa</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="map-popup"><p>⏳ Loading weather...</p></div>
                            )}
                        </Popup>
                    </Marker>
                </MapContainer>

                {/* Location button */}
                <button
                    onClick={handleGetCurrentLocation}
                    style={{
                        position: "absolute",
                        bottom: "15px",
                        right: "15px",
                        zIndex: 400,
                        padding: "10px 15px",
                        backgroundColor: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#764ba2";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#667eea";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                >
                    📍 My Location
                </button>
            </div>
        </div>
    );
};

export default MapWithWeather;