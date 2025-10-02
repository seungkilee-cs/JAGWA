// Core weather data fetching and conversion logic

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: number;
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
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  convertCtoF(celsius: number): number {
    return (celsius * 9/5) + 32;
  }

  convertFtoC(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
  }
}

export const weatherService = new WeatherService();
