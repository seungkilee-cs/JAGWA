<script lang="ts">
  import { onMount } from 'svelte';
  import { weatherService } from './lib/services/weatherService';
  import { weatherData, error, isLoading } from './lib/stores/weatherStore';
  import LocationSearch from './components/LocationSearch.svelte';
  import WeatherDisplay from './components/WeatherDisplay.svelte';
  import UnitToggle from './components/UnitToggle.svelte';
  import UvIndex from './components/UvIndex.svelte';
  import Precipitation from './components/Precipitation.svelte';
  import AirQuality from './components/AirQuality.svelte';
  
  async function handleSearch(location: string) {
    try {
      $isLoading = true;
      $error = null;
      const data = await weatherService.getCurrentWeather(location);
      $weatherData = data;
    } catch (err) {
      $error = 'Failed to fetch weather data. Please try again.';
      console.error(err);
    } finally {
      $isLoading = false;
    }
  }
  
  // Load default location on mount
  onMount(() => {
    handleSearch('Seoul');
  });
</script>

<main>
  <h1>JAGWA Weather</h1>
  
  <div class="controls">
    <LocationSearch on:search={(e) => handleSearch(e.detail)} />
    <UnitToggle />
  </div>
  
  {#if $isLoading}
    <div class="loading">Loading weather data...</div>
  {:else if $error}
    <div class="error">{$error}</div>
  {/if}
  
  <WeatherDisplay />

  <div class="additional-metrics">
    <UvIndex />
    <Precipitation />
    <AirQuality />
  </div>
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  :global(html, body) {
    height: 100%;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  :global(#app) {
    min-height: 100vh;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  main {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2.5rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .loading, .error {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .error {
    background: rgba(255, 99, 71, 0.2);
    color: #ffcccb;
  }

  .additional-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
</style>
