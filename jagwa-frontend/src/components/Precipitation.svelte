<script lang="ts">
  import { weatherData } from '../lib/stores/weatherStore';

  $: precipitation = $weatherData?.precipitation;
</script>

{#if precipitation !== undefined}
  <div class="precipitation-display">
    <h3>Precipitation (1h)</h3>
    <div class="precipitation-value">{precipitation.toFixed(2)} mm</div>
  </div>
{/if}

<style>
  .precipitation-display {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
  }
  .precipitation-value {
    font-size: 2rem;
    font-weight: bold;
  }
</style>