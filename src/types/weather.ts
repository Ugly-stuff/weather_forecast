export interface WeatherData {
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    main: {
        temp: number;
        humidity: number;
        feels_like: number;
        pressure: number;
    };
    weather: {
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
    };
    clouds: {
        all: number;
    };
    visibility: number;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    aqi?: number;
}

export interface AQIData {
    list: Array<{
        main: {
            aqi: number;
        };
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            nh3: number;
        };
    }>;
}

export interface ForecastData {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            humidity: number;
            feels_like: number;
        };
        weather: {
            main: string;
            description: string;
            icon: string;
        }[];
        wind: {
            speed: number;
        };
        clouds: {
            all: number;
        };
        pop?: number;
    }>;
    city: {
        name: string;
        country: string;
    };
}

export interface CityItem {
    name: string;
    lat: number;
    lon: number;
    country?: string;
    state?: string;
}