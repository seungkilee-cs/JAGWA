// Core weather data fetching and conversion logic

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: number;
  uvi: number;
  precipitation: number;
  aqi: number;
}

interface Coordinates {
  lat: number;
  lon: number;
}

class WeatherService {
  private apiKey: string = import.meta.env.VITE_WEATHER_API_KEY || '';
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  private async getCoordinates(location: string): Promise<Coordinates> {
    const response = await fetch(
      `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }
    const data = await response.json();
    return { lat: data.coord.lat, lon: data.coord.lon };
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const { lat, lon } = await this.getCoordinates(location);

      const [oneCallResponse, airPollutionResponse] = await Promise.all([
        fetch(
          `${this.baseUrl}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${this.apiKey}&units=metric`
        ),
        fetch(
          `${this.baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
        ),
      ]);

      if (!oneCallResponse.ok || !airPollutionResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const oneCallData = await oneCallResponse.json();
      const airPollutionData = await airPollutionResponse.json();
      
      return {
        temperature: oneCallData.current.temp,
        feelsLike: oneCallData.current.feels_like,
        humidity: oneCallData.current.humidity,
        windSpeed: oneCallData.current.wind_speed,
        description: oneCallData.current.weather[0].description,
        icon: oneCallData.current.weather[0].icon,
        uvi: oneCallData.current.uvi,
        precipitation: oneCallData.current.rain?.['1h'] || 0,
        aqi: airPollutionData.list[0].main.aqi,
        timestamp: Date.now(),
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
