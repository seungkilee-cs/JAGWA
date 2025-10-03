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

class WeatherService {
  private apiKey: string = import.meta.env.VITE_WEATHER_API_KEY || '';
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

  async getCurrentWeather(location: string): Promise<WeatherData> {
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
}

export default new WeatherService();
