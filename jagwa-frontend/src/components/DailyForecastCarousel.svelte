<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { dailyForecasts, unit } from '../lib/stores/weatherStore';
  import type { DailyForecast } from '../lib/services/weatherService';

  const MAX_VISIBLE = 5;
  const SWIPE_THRESHOLD = 45; // px

  export let selectedIndex = 0;

  const dispatch = createEventDispatcher<{ select: number }>();
  const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
  const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

  let carouselElement: HTMLDivElement | null = null;
  let touchStartX: number | null = null;
  let touchCurrentX: number | null = null;

  let visibleDays: DailyForecast[] = [];
  let currentUnit: 'celsius' | 'fahrenheit' = 'celsius';
  let selectedDay: DailyForecast | undefined;

  $: visibleDays = $dailyForecasts.slice(0, MAX_VISIBLE);
  $: currentUnit = $unit;

  $: {
    if (visibleDays.length === 0) {
      selectedIndex = 0;
      selectedDay = undefined;
    } else {
      if (selectedIndex >= visibleDays.length) {
        selectedIndex = 0;
        dispatch('select', selectedIndex);
      }
      selectedDay = visibleDays[selectedIndex];
    }
  }

  $: scrollToSelected(selectedIndex);

  function formatTemperature(value: number | undefined, currentUnit: 'celsius' | 'fahrenheit') {
    if (value === undefined || value === null) return '—';
    const temp = currentUnit === 'celsius' ? value : (value * 9) / 5 + 32;
    return `${Math.round(temp)}°`;
  }

  function formatPop(value: number | undefined) {
    if (value === undefined || value === null) return '—';
    return `${Math.round(value)}%`;
  }

  function describeConditions(forecast: DailyForecast | undefined) {
    if (!forecast) return '—';
    const description = forecast.description ? forecast.description : '—';
    const precipitation = forecast.rain > 0
      ? `${forecast.rain.toFixed(1)} mm rain`
      : forecast.snow > 0
        ? `${forecast.snow.toFixed(1)} mm snow`
        : 'No precipitation';
    return `${description} • ${precipitation}`;
  }

  function selectDay(index: number) {
    if (index < 0 || index >= visibleDays.length) return;
    selectedIndex = index;
    selectedDay = visibleDays[index];
    dispatch('select', index);
  }

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
  }

  function handleTouchMove(event: TouchEvent) {
    if (touchStartX === null) return;
    touchCurrentX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchCurrentX === null) {
      touchStartX = null;
      touchCurrentX = null;
      return;
    }

    const deltaX = touchCurrentX - touchStartX;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0 && selectedIndex < visibleDays.length - 1) {
        selectDay(selectedIndex + 1);
      } else if (deltaX > 0 && selectedIndex > 0) {
        selectDay(selectedIndex - 1);
      }
    }

    touchStartX = null;
    touchCurrentX = null;
  }

  function scrollToSelected(index: number) {
    if (!carouselElement || index < 0 || index >= visibleDays.length) return;
    const cards = carouselElement.querySelectorAll<HTMLButtonElement>('.day-card');
    const selectedCard = cards[index];
    selectedCard?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
</script>

{#if visibleDays.length === 0}
  <div class="empty">No daily forecast available.</div>
{:else}
  <div
    class="carousel"
    role="tablist"
    aria-label="Daily forecast"
    bind:this={carouselElement}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    {#each visibleDays as day, index}
      <button
        type="button"
        class={`day-card ${index === selectedIndex ? 'day-card--active' : ''}`}
        role="tab"
        aria-selected={index === selectedIndex}
        on:click={() => selectDay(index)}
      >
        <div class="day-card__header">
          <span class="day-card__weekday">{weekdayFormatter.format(day.date)}</span>
          <span class="day-card__date">{dateFormatter.format(day.date)}</span>
        </div>
        <div class="day-card__temps">
          <span class="temp temp--max">{formatTemperature(day.maxTemp, currentUnit)}</span>
          <span class="temp temp--min">{formatTemperature(day.minTemp, currentUnit)}</span>
        </div>
        <div class="day-card__meta">
          <span class="day-card__pop" aria-label="Precipitation chance">{formatPop(day.precipitationProbability)}</span>
          <span class="day-card__summary">{day.description || '—'}</span>
        </div>
      </button>
    {/each}
  </div>

  {#if selectedDay}
    <section class="details" aria-live="polite" transition:fade={{ duration: 220 }}>
      <header class="details__header">
        <h2>{weekdayFormatter.format(selectedDay.date)} Overview</h2>
        <span>{dateFormatter.format(selectedDay.date)}</span>
      </header>
      <div class="details__content">
        <div class="details__block">
          <h3>Conditions</h3>
          <p>{describeConditions(selectedDay)}</p>
        </div>
        <div class="details__grid">
          <div>
            <h4>Day</h4>
            <p>{formatTemperature(selectedDay.dayTemp, currentUnit)}</p>
          </div>
          <div>
            <h4>Night</h4>
            <p>{formatTemperature(selectedDay.nightTemp, currentUnit)}</p>
          </div>
          <div>
            <h4>Humidity</h4>
            <p>{selectedDay.humidity}%</p>
          </div>
          <div>
            <h4>Wind</h4>
            <p>{selectedDay.windSpeed.toFixed(1)} m/s</p>
          </div>
          <div>
            <h4>Sunrise</h4>
            <p>{timeFormatter.format(selectedDay.sunrise)}</p>
          </div>
          <div>
            <h4>Sunset</h4>
            <p>{timeFormatter.format(selectedDay.sunset)}</p>
          </div>
          <div>
            <h4>UV Index</h4>
            <p>{selectedDay.uvi.toFixed(1)}</p>
          </div>
          <div>
            <h4>Precipitation</h4>
            <p>{formatPop(selectedDay.precipitationProbability)}</p>
          </div>
        </div>
      </div>
    </section>
  {/if}
{/if}

<style>
  .empty {
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    text-align: center;
    color: rgba(255, 255, 255, 0.85);
  }

  .carousel {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0.5rem 0;
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }

  .day-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 0.5rem;
    min-width: 70px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    color: white;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .day-card:hover,
  .day-card:focus {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    outline: none;
  }

  .day-card--active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .day-card__header {
    text-align: center;
  }

  .day-card__weekday {
    font-size: 0.7rem;
    font-weight: 500;
    opacity: 0.8;
  }

  .day-card__date {
    font-size: 0.6rem;
    opacity: 0.6;
  }

  .day-card__temps {
    text-align: center;
  }

  .temp--max {
    font-size: 0.9rem;
    font-weight: 600;
    display: block;
  }

  .temp--min {
    font-size: 0.75rem;
    opacity: 0.6;
    display: block;
  }

  .day-card__meta {
    text-align: center;
  }

  .day-card__pop {
    font-size: 0.65rem;
    color: rgba(96, 165, 250, 0.9);
    font-weight: 500;
  }

  .day-card__summary {
    font-size: 0.6rem;
    opacity: 0.7;
    display: none;
  }

  .details {
    margin-top: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .details__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.9);
  }

  .details__content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .details__block h3 {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.95);
  }

  .details__block p {
    margin: 0;
    color: rgba(255, 255, 255, 0.75);
  }

  .details__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .details__grid h4 {
    margin: 0 0 0.125rem;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .details__grid p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 720px) {
    .day-card {
      min-width: 140px;
    }
  }
</style>
