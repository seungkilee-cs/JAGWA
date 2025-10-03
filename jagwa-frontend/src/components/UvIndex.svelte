<script lang="ts">
  import { weatherData } from '../lib/stores/weatherStore';

  $: uvi = $weatherData?.uvi;

  function getUviClass(index: number) {
    if (index <= 2) return 'low';
    if (index <= 5) return 'moderate';
    if (index <= 7) return 'high';
    if (index <= 10) return 'very-high';
    return 'extreme';
  }
</script>

{#if uvi !== undefined}
  <div class="uvi-display">
    <h3>UV Index</h3>
    <div class="uvi-value {getUviClass(uvi)}">{uvi.toFixed(1)}</div>
  </div>
{/if}

<style>
  .uvi-display {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
  }
  .uvi-value {
    font-size: 2rem;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }
  .low { background-color: #4caf50; }
  .moderate { background-color: #ffeb3b; color: #000; }
  .high { background-color: #ff9800; }
  .very-high { background-color: #f44336; }
  .extreme { background-color: #9c27b0; }
</style>