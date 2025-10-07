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
  import WeatherDisplay from './components/WeatherDisplay.svelte';
  import UnitToggle from './components/UnitToggle.svelte';
  import PrecipitationChart from './components/PrecipitationChart.svelte';
  import PrecipitationAmountChart from './components/PrecipitationAmountChart.svelte';
  import AQIDisplay from './components/AQIDisplay.svelte';
  import UVIndexDisplay from './components/UVIndexDisplay.svelte';
  import DailyForecastCarousel from './components/DailyForecastCarousel.svelte';
  const DEFAULT_LOCATION = 'Seoul';
  let selectedDailyIndex = 0;

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
        selectedDailyIndex = 0;
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
      <WeatherDisplay />

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

      {#if $dailyForecasts.length > 0}
        <section class="daily-forecast" aria-label="Upcoming daily forecast">
          <h2>5-Day Outlook</h2>
          <DailyForecastCarousel bind:selectedIndex={selectedDailyIndex} />
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
    padding: 2.5rem clamp(1rem, 4vw, 3.5rem) 4.5rem;
    min-height: 100vh;
    background: radial-gradient(circle at 10% 20%, rgba(148, 163, 184, 0.18), transparent 55%),
      radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.2), transparent 60%),
      linear-gradient(180deg, #020617 0%, #0f172a 45%, #1f2937 100%);
    color: white;
  }

  .app__header {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2.25rem;
  }

  .metrics {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .daily-forecast {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .daily-forecast h2 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(226, 232, 240, 0.92);
  }

  .charts {
    display: grid;
    gap: 2rem;
  }

  .chart-card {
    position: relative;
    border-radius: 1.5rem;
    padding: 1.6rem;
    background: linear-gradient(140deg, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.22));
    border: 1px solid rgba(148, 163, 184, 0.12);
    box-shadow: 0 24px 38px rgba(2, 6, 23, 0.45);
    backdrop-filter: blur(18px);
    overflow: hidden;
  }

  .chart-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at 25% 20%, rgba(96, 165, 250, 0.25), transparent 55%);
    opacity: 0.8;
    pointer-events: none;
  }

  .chart-card h2 {
    position: relative;
    margin: 0 0 0.85rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: rgba(226, 232, 240, 0.9);
    letter-spacing: 0.03em;
  }

  .banner {
    padding: 1rem 1.5rem;
    border-radius: 0.85rem;
    text-align: center;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    border: 1px solid transparent;
    margin-bottom: 1rem;
  }

  .banner--error {
    background: rgba(220, 38, 38, 0.25);
    border-color: rgba(248, 113, 113, 0.4);
  }

  .banner--loading {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(191, 219, 254, 0.35);
  }

  .banner--info {
    background: rgba(110, 231, 183, 0.18);
    border-color: rgba(134, 239, 172, 0.35);
  }

  @media (min-width: 900px) {
    .charts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2.25rem;
    }
  }

  @media (max-width: 640px) {
    .app {
      padding: 2rem 1.25rem 3rem;
    }

    .content {
      gap: 1.75rem;
    }

    .charts {
      gap: 1.5rem;
    }
  }
</style>
