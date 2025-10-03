<script lang="ts">
  import { weatherData, unit } from '../lib/stores/weatherStore';
  import { formatTemp } from '../lib/stores/weatherStore';
  
  $: currentWeather = $weatherData;
  $: currentUnit = $unit;
</script>

{#if currentWeather}
  <div class="weather-display">
    <img
      class="weather-icon"
      src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
      alt={currentWeather.description}
    />
    <div class="temperature">
      {formatTemp(currentWeather.temperature, currentUnit)}
    </div>
    
    <div class="details">
      <div class="feels-like">
        Feels like: {formatTemp(currentWeather.feelsLike, currentUnit)}
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .weather-icon {
    width: 100px;
    height: 100px;
    margin-bottom: -1rem;
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
