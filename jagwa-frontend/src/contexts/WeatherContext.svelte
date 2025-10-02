<script lang="ts">
  import { writable } from 'svelte/store';
  import type { WeatherData } from '../lib/services/weatherService';
  
  export const weatherData = writable<WeatherData | null>(null);
  export const error = writable<string | null>(null);
  export const isLoading = writable<boolean>(false);
  export const unit = writable<'celsius' | 'fahrenheit'>('celsius');
  
  export function toggleUnit() {
    unit.update(current => current === 'celsius' ? 'fahrenheit' : 'celsius');
  }
  
  export function formatTemp(temp: number, currentUnit: 'celsius' | 'fahrenheit'): string {
    const displayTemp = currentUnit === 'celsius' 
      ? Math.round(temp) 
      : Math.round((temp * 9/5) + 32);
    return `${displayTemp}°${currentUnit === 'celsius' ? 'C' : 'F'}`;
  }
</script>

<slot />
