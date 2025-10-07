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
    <div class="hero__backdrop"></div>
    <div class="hero__content">
      <div class="hero__top">
        <div class="hero__meta">
          <span class="hero__label">Right now</span>
          <span class="hero__timestamp">{timeFormatter.format(currentWeather.timestamp)}</span>
        </div>
        <div class="hero__icon">
          <img src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`} alt={currentWeather.description} />
        </div>
      </div>
      <div class="hero__temperature">{displayTemp}°</div>
      <div class="hero__description">{currentWeather.description}</div>

      <div class="hero__details">
        <div>
          <span class="detail__label">Feels like</span>
          <span class="detail__value">{feelsLike}°</span>
        </div>
        <div>
          <span class="detail__label">Humidity</span>
          <span class="detail__value">{currentWeather.humidity}%</span>
        </div>
        <div>
          <span class="detail__label">Wind</span>
          <span class="detail__value">{currentWeather.windSpeed.toFixed(1)} m/s</span>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .hero {
    position: relative;
    overflow: hidden;
    border-radius: 1.75rem;
    padding: 2.5rem;
    display: flex;
    justify-content: center;
    color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(18px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
    min-height: 320px;
    background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.55), transparent 60%),
      radial-gradient(circle at 80% 30%, rgba(244, 114, 182, 0.45), transparent 55%),
      linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.6));
  }

  .hero__backdrop {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(15, 23, 42, 0.6), rgba(17, 24, 39, 0.3));
    backdrop-filter: blur(25px);
    z-index: 0;
  }

  .hero__content {
    position: relative;
    z-index: 1;
    width: min(100%, 640px);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .hero__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .hero__meta {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .hero__label {
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .hero__timestamp {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .hero__icon img {
    width: 88px;
    height: 88px;
  }

  .hero__temperature {
    font-size: clamp(4rem, 8vw, 6.5rem);
    font-weight: 700;
    line-height: 1;
  }

  .hero__description {
    font-size: 1.4rem;
    text-transform: capitalize;
    color: rgba(255, 255, 255, 0.85);
  }

  .hero__details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .detail__label {
    display: block;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.35rem;
  }

  .detail__value {
    font-size: 1.4rem;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    .hero {
      padding: 2rem;
      border-radius: 1.5rem;
    }

    .hero__top {
      flex-direction: column;
      gap: 1rem;
    }

    .hero__icon img {
      width: 72px;
      height: 72px;
    }

    .hero__details {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
  }
</style>
