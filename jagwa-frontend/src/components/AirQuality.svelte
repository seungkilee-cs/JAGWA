<script lang="ts">
  import { weatherData } from '../lib/stores/weatherStore';

  $: aqi = $weatherData?.aqi;

  function getAqiInfo(index: number): { label: string; className: string } {
    switch (index) {
      case 1: return { label: 'Good', className: 'good' };
      case 2: return { label: 'Fair', className: 'fair' };
      case 3: return { label: 'Moderate', className: 'moderate' };
      case 4: return { label: 'Poor', className: 'poor' };
      case 5: return { label: 'Very Poor', className: 'very-poor' };
      default: return { label: 'Unknown', className: 'unknown' };
    }
  }

  $: aqiInfo = aqi !== undefined ? getAqiInfo(aqi) : { label: 'Unknown', className: 'unknown' };
</script>

{#if aqi !== undefined}
  <div class="aqi-display">
    <h3>Air Quality</h3>
    <div class="aqi-value {aqiInfo.className}">{aqiInfo.label}</div>
  </div>
{/if}

<style>
  .aqi-display {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
  }
  .aqi-value {
    font-size: 2rem;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }
  .good { background-color: #4caf50; }
  .fair { background-color: #ffeb3b; color: #000; }
  .moderate { background-color: #ff9800; }
  .poor { background-color: #f44336; }
  .very-poor { background-color: #9c27b0; }
</style>