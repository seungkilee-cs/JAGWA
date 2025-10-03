<script lang="ts">
  import { onMount } from 'svelte';
  import weatherService from './lib/services/weatherService';
  import { weatherData, error, isLoading } from './lib/stores/weatherStore';
  import LocationSearch from './components/LocationSearch.svelte';
  import WeatherDisplay from './components/WeatherDisplay.svelte';
  import UnitToggle from './components/UnitToggle.svelte';
  import PrecipitationChart from './components/PrecipitationChart.svelte';
  import AQIDisplay from './components/AQIDisplay.svelte';
  
  let forecasts: any[] = [];
  let aqi: number | null = null;
  
  async function handleSearch(location: string) {
    try {
      $isLoading = true;
      $error = null;
      const data = await weatherService.getCurrentWeather(location);
      $weatherData = data;
      
      // Fetch hourly forecast
      const hourlyData = await weatherService.getHourlyForecast(location);
      forecasts = hourlyData;
      
      // Fetch AQI
      if (data.coord) {
        aqi = await weatherService.getAQI(data.coord.lat, data.coord.lon);
      }
    } catch (err) {
      $error = 'Failed to fetch weather data. Please try again.';
      console.error(err);
    } finally {
      $isLoading = false;
    }
  }
  
  onMount(() => {
    handleSearch('Seoul');
  });
</script>
