import sampleWeather from '../mock/sample-weather-data.json';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: number;
  coord?: {
    lat: number;
    lon: number;
  };
}

export interface HourlyForecast {
  time: number;
  precipitation: number;
  rain: number;
  snow: number;
  temperature: number;
  icon: string;
}

export interface DailyForecast {
  date: number;
  sunrise: number;
  sunset: number;
  minTemp: number;
  maxTemp: number;
  dayTemp: number;
  nightTemp: number;
  description: string;
  icon: string;
  precipitationProbability: number;
  rain: number;
  snow: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvi: number;
}

class WeatherService {
  private apiKey: string = import.meta.env.VITE_WEATHER_API_KEY || '';
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private useMockData: boolean = !this.apiKey;
  private oneCallCache = new Map<string, { timestamp: number; data: any }>();

  async getCurrentWeather(location: string): Promise<WeatherData> {
    if (this.useMockData) {
      const data = sampleWeather.current;
      return {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        timestamp: data.dt * 1000,
        coord: data.coord ? { lat: data.coord.lat, lon: data.coord.lon } : undefined
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      return {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        timestamp: Date.now(),
        coord: data.coord ? { lat: data.coord.lat, lon: data.coord.lon } : undefined
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getHourlyForecast(location: string): Promise<HourlyForecast[]> {
    if (this.useMockData) {
      return sampleWeather.forecast.list.map(item => ({
        time: item.dt * 1000,
        precipitation: (item.pop ?? 0) * 100,
        rain: item.rain ? item.rain['3h'] ?? 0 : 0,
        snow: item.snow ? item.snow['3h'] ?? 0 : 0,
        temperature: item.main.temp,
        icon: item.weather[0].icon
      }));
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const data = await response.json();
      
      return data.list.map((item: any) => ({
        time: item.dt * 1000,
        precipitation: item.pop * 100,
        rain: item.rain ? item.rain['3h'] : 0,
        snow: item.snow ? item.snow['3h'] : 0,
        temperature: item.main.temp,
        icon: item.weather[0].icon
      }));
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }

  async getAQI(latitude: number, longitude: number): Promise<number> {
    if (this.useMockData) {
      const data = sampleWeather.air_pollution.list[0];
      return data.main.aqi;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch AQI data');
      }

      const data = await response.json();
      return data.list[0].main.aqi;
    } catch (error) {
      console.error('Error fetching AQI data:', error);
      throw error;
    }
  }

  async getUVIndex(latitude: number, longitude: number): Promise<number> {
    const data = await this.fetchOneCallData(latitude, longitude);
    return data.current?.uvi ?? 0;
  }

  async getDailyForecast(latitude: number, longitude: number): Promise<DailyForecast[]> {
    const data = await this.fetchOneCallData(latitude, longitude);
    const daily = data.daily ?? [];

    return daily.map((entry: any) => ({
      date: entry.dt * 1000,
      sunrise: entry.sunrise * 1000,
      sunset: entry.sunset * 1000,
      minTemp: entry.temp?.min,
      maxTemp: entry.temp?.max,
      dayTemp: entry.temp?.day,
      nightTemp: entry.temp?.night,
      description: entry.weather?.[0]?.description ?? '',
      icon: entry.weather?.[0]?.icon ?? '',
      precipitationProbability: (entry.pop ?? 0) * 100,
      rain: entry.rain ?? 0,
      snow: entry.snow ?? 0,
      humidity: entry.humidity,
      windSpeed: entry.wind_speed,
      windDirection: entry.wind_deg,
      uvi: entry.uvi ?? 0
    }));
  }

  private async fetchOneCallData(latitude: number, longitude: number): Promise<any> {
    if (this.useMockData) {
      return sampleWeather.onecall;
    }

    const cacheKey = `${latitude},${longitude}`;
    const cached = this.oneCallCache.get(cacheKey);
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch One Call weather data');
      }

      const data = await response.json();
      this.oneCallCache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } catch (error) {
      console.error('Error fetching One Call weather data:', error);
      throw error;
    }
  }
}

export default new WeatherService();
