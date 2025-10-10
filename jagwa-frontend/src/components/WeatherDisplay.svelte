<script lang="ts">
  import { weatherData, unit } from '../lib/stores/weatherStore';

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });

  $: currentWeather = $weatherData;
  $: currentUnit = $unit;
  $: displayTemp = currentWeather
    ? currentUnit === 'celsius'
      ? Math.round(currentWeather.temperature)
      : Math.round((currentWeather.temperature * 9) / 5 + 32)
    : null;
  $: feelsLike = currentWeather
    ? currentUnit === 'celsius'
      ? Math.round(currentWeather.feelsLike)
      : Math.round((currentWeather.feelsLike * 9) / 5 + 32)
    : null;
</script>

{#if currentWeather}
  <section class="hero" aria-label="Current weather overview">
    <div class="hero__location">
      <div class="hero__city">Current Location</div>
      <div class="hero__time">{timeFormatter.format(currentWeather.timestamp)}</div>
    </div>
    
    <div class="hero__main">
      <div class="hero__temperature">{displayTemp}°</div>
      <div class="hero__icon">
        <img src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`} alt={currentWeather.description} />
      </div>
    </div>
    
    <div class="hero__description">{currentWeather.description}</div>
    
    <div class="hero__range">
      H:{Math.round(currentWeather.temperature + 3)}° L:{Math.round(currentWeather.temperature - 5)}°
    </div>

    <div class="hero__details">
      <div class="detail">
        <div class="detail__icon">💧</div>
        <div class="detail__content">
          <div class="detail__label">Humidity</div>
          <div class="detail__value">{currentWeather.humidity}%</div>
        </div>
      </div>
      <div class="detail">
        <div class="detail__icon">🌡️</div>
        <div class="detail__content">
          <div class="detail__label">Feels like</div>
          <div class="detail__value">{feelsLike}°</div>
        </div>
      </div>
      <div class="detail">
        <div class="detail__icon">💨</div>
        <div class="detail__content">
          <div class="detail__label">Wind</div>
          <div class="detail__value">{currentWeather.windSpeed.toFixed(1)} m/s</div>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .hero {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    padding: 1.5rem 1rem;
    text-align: center;
    color: white;
  }

  .hero__location {
    margin-bottom: 0.75rem;
  }

  .hero__city {
    font-size: 1.2rem;
    font-weight: 400;
    margin-bottom: 0.25rem;
  }

  .hero__time {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .hero__main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 1rem 0 0.75rem;
  }

  .hero__temperature {
    font-size: clamp(3rem, 10vw, 5rem);
    font-weight: 200;
    line-height: 0.9;
  }

  .hero__icon img {
    width: clamp(60px, 12vw, 80px);
    height: clamp(60px, 12vw, 80px);
  }

  .hero__description {
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 0.5rem;
    opacity: 0.9;
  }

  .hero__range {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .hero__details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    text-align: center;
  }

  .detail__icon {
    font-size: 1.2rem;
  }

  .detail__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .detail__label {
    font-size: 0.7rem;
    opacity: 0.7;
    margin-bottom: 0.125rem;
  }

  .detail__value {
    font-size: 0.9rem;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .hero__main {
      flex-direction: column;
      gap: 0.5rem;
    }

    .hero__details {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .detail {
      flex-direction: row;
      justify-content: flex-start;
      text-align: left;
    }

    .detail__content {
      align-items: flex-start;
    }
  }

  @media (min-width: 768px) {
    .hero {
      padding: 2rem;
    }

    .hero__details {
      gap: 1rem;
    }

    .detail {
      padding: 0.75rem;
    }
  }
</style>
