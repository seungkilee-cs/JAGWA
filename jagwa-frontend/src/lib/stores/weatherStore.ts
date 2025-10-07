import { writable } from 'svelte/store';
import type { WeatherData, HourlyForecast, DailyForecast } from '../services/weatherService';

export const weatherData = writable<WeatherData | null>(null);
export const error = writable<string | null>(null);
export const isLoading = writable<boolean>(false);
export const unit = writable<'celsius' | 'fahrenheit'>('celsius');
export const hourlyForecasts = writable<HourlyForecast[]>([]);
export const aqiValue = writable<number | null>(null);
export const uvIndex = writable<number | null>(null);
export const dailyForecasts = writable<DailyForecast[]>([]);

export function resetWeatherState() {
  weatherData.set(null);
  hourlyForecasts.set([]);
  aqiValue.set(null);
  uvIndex.set(null);
  dailyForecasts.set([]);
}

export function toggleUnit() {
  unit.update(current => current === 'celsius' ? 'fahrenheit' : 'celsius');
}

export function formatTemp(temp: number, currentUnit: 'celsius' | 'fahrenheit'): string {
  const displayTemp = currentUnit === 'celsius' 
    ? Math.round(temp) 
    : Math.round((temp * 9/5) + 32);
  return `${displayTemp}°${currentUnit === 'celsius' ? 'C' : 'F'}`;
}
