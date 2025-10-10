<script lang="ts">
  import { weatherData, dailyForecasts, unit } from '../lib/stores/weatherStore';
  import type { DailyForecast } from '../lib/services/weatherService';

  const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
  const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

  let selectedIndex = 0;
  let carouselElement: HTMLDivElement;
  let touchStartX: number | null = null;

  $: currentWeather = $weatherData;
  $: currentUnit = $unit;
  $: allCards = currentWeather ? [
    {
      type: 'current',
      data: currentWeather,
      title: 'Now',
      subtitle: timeFormatter.format(currentWeather.timestamp),
      location: true
    },
    ...$dailyForecasts.map((forecast, index) => ({
      type: 'forecast',
      data: forecast,
      title: index === 0 ? 'Today' : weekdayFormatter.format(forecast.date),
      subtitle: dateFormatter.format(forecast.date),
      location: false
    }))
  ] : [];

  function formatTemp(temp: number): string {
    const displayTemp = currentUnit === 'celsius' 
      ? Math.round(temp) 
      : Math.round((temp * 9/5) + 32);
    return `${displayTemp}°`;
  }

  function scrollToCard(index: number) {
    if (!carouselElement) return;
    const cards = carouselElement.querySelectorAll('.weather-card');
    const targetCard = cards[index];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function handleCardClick(index: number) {
    selectedIndex = index;
    scrollToCard(index);
  }

  function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent) {
    if (touchStartX === null) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && selectedIndex < allCards.length - 1) {
        handleCardClick(selectedIndex + 1);
      } else if (deltaX < 0 && selectedIndex > 0) {
        handleCardClick(selectedIndex - 1);
      }
    }
    
    touchStartX = null;
  }
</script>

{#if allCards.length > 0}
  <section class="weather-carousel" aria-label="Weather forecast carousel">
    <div 
      class="carousel-container" 
      bind:this={carouselElement}
      on:touchstart={handleTouchStart}
      on:touchend={handleTouchEnd}
    >
      {#each allCards as card, index}
        <button
          class="weather-card {card.type} {index === selectedIndex ? 'active' : ''}"
          on:click={() => handleCardClick(index)}
          aria-label="{card.title} weather details"
        >
          {#if card.type === 'current'}
            <div class="card-header">
              <div class="card-title">
                <span class="location-dot">📍</span>
                {card.title}
              </div>
              <div class="card-subtitle">{card.subtitle}</div>
            </div>
            
            <div class="current-main">
              <div class="current-temp">{formatTemp(card.data.temperature)}</div>
              <div class="current-icon">
                <img src={`https://openweathermap.org/img/wn/${card.data.icon}@2x.png`} alt={card.data.description} />
              </div>
            </div>
            
            <div class="current-desc">{card.data.description}</div>
            
            <div class="current-details">
              <div class="detail-item">
                <span class="detail-label">Feels</span>
                <span class="detail-value">{formatTemp(card.data.feelsLike)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Humidity</span>
                <span class="detail-value">{card.data.humidity}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Wind</span>
                <span class="detail-value">{card.data.windSpeed.toFixed(1)}m/s</span>
              </div>
            </div>
          {:else}
            <div class="card-header">
              <div class="card-title">{card.title}</div>
              <div class="card-subtitle">{card.subtitle}</div>
            </div>
            
            <div class="forecast-icon">
              <img src={`https://openweathermap.org/img/wn/${card.data.icon}@2x.png`} alt={card.data.description} />
            </div>
            
            <div class="forecast-temps">
              <div class="temp-high">{formatTemp(card.data.maxTemp)}</div>
              <div class="temp-low">{formatTemp(card.data.minTemp)}</div>
            </div>
            
            <div class="forecast-desc">{card.data.description}</div>
            
            <div class="forecast-details">
              <div class="detail-row">
                <span class="detail-icon">💧</span>
                <span class="detail-text">{Math.round(card.data.precipitationProbability)}%</span>
              </div>
              <div class="detail-row">
                <span class="detail-icon">💨</span>
                <span class="detail-text">{card.data.windSpeed.toFixed(1)}m/s</span>
              </div>
              <div class="detail-row">
                <span class="detail-icon">☀️</span>
                <span class="detail-text">UV {card.data.uvi.toFixed(1)}</span>
              </div>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </section>
{/if}

<style>
  .weather-carousel {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
  }

  .carousel-container {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-snap-type: x mandatory;
    padding-bottom: 0.5rem;
  }

  .carousel-container::-webkit-scrollbar {
    display: none;
  }

  .weather-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.25rem 1rem;
    min-width: 200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    scroll-snap-align: center;
    text-align: center;
  }

  .weather-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .weather-card.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .weather-card.current {
    min-width: 240px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.9;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
  }

  .location-dot {
    font-size: 0.8rem;
  }

  .card-subtitle {
    font-size: 0.75rem;
    opacity: 0.6;
  }

  /* Current weather styles */
  .current-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 0.5rem 0;
  }

  .current-temp {
    font-size: 2.5rem;
    font-weight: 200;
    line-height: 1;
  }

  .current-icon img {
    width: 60px;
    height: 60px;
  }

  .current-desc {
    font-size: 0.9rem;
    text-transform: capitalize;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  .current-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .detail-value {
    font-size: 0.8rem;
    font-weight: 500;
  }

  /* Forecast styles */
  .forecast-icon img {
    width: 50px;
    height: 50px;
  }

  .forecast-temps {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    align-items: baseline;
  }

  .temp-high {
    font-size: 1.25rem;
    font-weight: 500;
  }

  .temp-low {
    font-size: 1rem;
    opacity: 0.6;
  }

  .forecast-desc {
    font-size: 0.8rem;
    text-transform: capitalize;
    opacity: 0.8;
  }

  .forecast-details {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .detail-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .detail-icon {
    font-size: 0.8rem;
  }

  .detail-text {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    .weather-card {
      min-width: 180px;
      padding: 1rem 0.75rem;
    }

    .weather-card.current {
      min-width: 200px;
    }

    .current-temp {
      font-size: 2rem;
    }

    .current-icon img {
      width: 50px;
      height: 50px;
    }
  }

  @media (min-width: 768px) {
    .weather-carousel {
      padding: 1.5rem;
    }

    .carousel-container {
      gap: 16px;
    }

    .weather-card {
      min-width: 220px;
      padding: 1.5rem 1.25rem;
    }

    .weather-card.current {
      min-width: 260px;
    }
  }
</style>