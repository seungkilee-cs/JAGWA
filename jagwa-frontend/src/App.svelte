<script lang="ts">
  import { onMount } from 'svelte';
  import weatherService from './lib/services/weatherService';
  import {
    weatherData,
    hourlyForecasts,
    aqiValue,
    uvIndex,
    dailyForecasts,
    error,
    isLoading,
    resetWeatherState
  } from './lib/stores/weatherStore';
  import LocationSearch from './components/LocationSearch.svelte';
  import UnitToggle from './components/UnitToggle.svelte';
  import WeatherCarousel from './components/WeatherCarousel.svelte';
  import PrecipitationChart from './components/PrecipitationChart.svelte';
  import PrecipitationAmountChart from './components/PrecipitationAmountChart.svelte';
  import AQIDisplay from './components/AQIDisplay.svelte';
  import UVIndexDisplay from './components/UVIndexDisplay.svelte';
  const DEFAULT_LOCATION = 'Seoul';

  async function handleSearch(location: string) {
    const normalizedLocation = location.trim();
    if (!normalizedLocation) {
      $error = 'Please enter a location to search.';
      return;
    }

    try {
      $isLoading = true;
      $error = null;
      resetWeatherState();

      const data = await weatherService.getCurrentWeather(normalizedLocation);
      $weatherData = data;

      const hourlyData = await weatherService.getHourlyForecast(normalizedLocation);
      $hourlyForecasts = hourlyData;

      if (data.coord) {
        const { lat, lon } = data.coord;
        const [aqi, uvi, daily] = await Promise.all([
          weatherService.getAQI(lat, lon),
          weatherService.getUVIndex(lat, lon),
          weatherService.getDailyForecast(lat, lon)
        ]);
        $aqiValue = aqi;
        $uvIndex = uvi;
        $dailyForecasts = daily;
      } else {
        $aqiValue = null;
        $uvIndex = null;
        $dailyForecasts = [];
      }
    } catch (err) {
      console.error(err);
      $error = 'Unable to load weather details right now. Please retry in a bit.';
      resetWeatherState();
    } finally {
      $isLoading = false;
    }
  }
  onMount(() => {
    handleSearch(DEFAULT_LOCATION);
  });
</script>

<main class="app">
  <header class="app__header">
    <LocationSearch on:search={(event) => handleSearch(event.detail)} />
    <UnitToggle />
  </header>

  {#if $error}
    <div class="banner banner--error">{$error}</div>
  {/if}

  {#if $isLoading}
    <div class="banner banner--loading">Fetching the latest weather details…</div>
  {/if}

  {#if !$isLoading && !$weatherData}
    <div class="banner banner--info">Search for a city to view current conditions.</div>
  {/if}

  {#if !$isLoading && $weatherData}
    <section class="content">
      <WeatherCarousel />

      {#if $aqiValue !== null || $uvIndex !== null}
        <section class="metrics" aria-label="Environmental metrics">
          {#if $aqiValue !== null}
            <AQIDisplay aqi={$aqiValue} />
          {/if}
          {#if $uvIndex !== null}
            <UVIndexDisplay uvi={$uvIndex} />
          {/if}
        </section>
      {/if}

      {#if $hourlyForecasts.length > 0}
        <section class="charts" aria-label="Precipitation insights">
          <div class="chart-card">
            <h2>Precipitation Probability</h2>
            <PrecipitationChart forecasts={$hourlyForecasts} />
          </div>

          <div class="chart-card">
            <h2>Rain vs. Snow (mm)</h2>
            <PrecipitationAmountChart forecasts={$hourlyForecasts} />
          </div>
        </section>
      {:else}
        <div class="banner banner--info">No hourly precipitation data available.</div>
      {/if}
    </section>
  {/if}
</main>

<style>
  .app {
    padding: 0;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    overflow-x: hidden;
    font-size: 14px;
  }

  .app__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  .metrics {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
  }



  .charts {
    display: grid;
    gap: 8px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
  }

  .chart-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .chart-card h2 {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .banner {
    padding: 0.75rem 1rem;
    text-align: center;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    color: white;
    border: none;
    margin: 8px 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .banner--error {
    background: rgba(239, 68, 68, 0.2);
  }

  .banner--loading {
    background: rgba(255, 255, 255, 0.15);
  }

  .banner--info {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 768px) {
    .app__header {
      padding: 1.25rem 2rem;
    }
    
    .metrics {
      grid-template-columns: repeat(4, 1fr);
      padding: 1.5rem;
    }
    
    .charts {
      grid-template-columns: repeat(2, 1fr);
      padding: 1.5rem;
    }
    

  }
</style>
