<script lang="ts">
  import { weatherData, unit } from '../lib/stores/weatherStore';
  import { formatTemp } from '../lib/stores/weatherStore';
  
  $: currentWeather = $weatherData;
  $: currentUnit = $unit;
</script>

{#if currentWeather}
  <div class="weather-display">
    <div class="temperature">
      {#if currentUnit === 'celsius'}
        {Math.round(currentWeather.temperature)}°C
      {:else}
        {Math.round((currentWeather.temperature * 9/5) + 32)}°F
      {/if}
    </div>
    
    <div class="details">
      <div class="feels-like">
        Feels like: {currentUnit === 'celsius' 
          ? Math.round(currentWeather.feelsLike) 
          : Math.round((currentWeather.feelsLike * 9/5) + 32)}°{currentUnit === 'celsius' ? 'C' : 'F'}
      </div>
      <div class="humidity">Humidity: {currentWeather.humidity}%</div>
      <div class="wind">Wind: {currentWeather.windSpeed} m/s</div>
      <div class="description">{currentWeather.description}</div>
    </div>
  </div>
{/if}

<style>
  .weather-display {
    color: white;
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .temperature {
    font-size: 4rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .details {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .description {
    text-transform: capitalize;
    margin-top: 0.5rem;
    font-style: italic;
  }
</style>
