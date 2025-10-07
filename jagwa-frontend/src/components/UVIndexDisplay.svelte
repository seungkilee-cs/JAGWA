<script lang="ts">
  export let uvi: number;

  interface UVLevel {
    min: number;
    max: number;
    label: string;
    description: string;
    color: string;
  }

  const uvLevels: UVLevel[] = [
    { min: 0, max: 2, label: 'Low', description: 'Minimal protection required.', color: '#16a34a' },
    { min: 3, max: 5, label: 'Moderate', description: 'Wear sunglasses and consider sunscreen.', color: '#f59e0b' },
    { min: 6, max: 7, label: 'High', description: 'Use SPF 30+, hat, and seek shade at midday.', color: '#ef4444' },
    { min: 8, max: 10, label: 'Very High', description: 'Extra protection needed; limit sun exposure.', color: '#9333ea' },
    { min: 11, max: Infinity, label: 'Extreme', description: 'Avoid sun exposure; stay indoors if possible.', color: '#7f1d1d' }
  ];

  function getUVLevel(value: number): UVLevel {
    return uvLevels.find(level => value >= level.min && value <= level.max) ?? uvLevels[0];
  }

  $: currentLevel = getUVLevel(uvi);
</script>

<div class="uv-index" style={`border-color: ${currentLevel.color};`}>
  <div class="uv-index__header">
    <span class="uv-index__value" style={`color: ${currentLevel.color};`}>{uvi.toFixed(1)}</span>
    <span class="uv-index__label">UV Index — {currentLevel.label}</span>
  </div>
  <p class="uv-index__description">{currentLevel.description}</p>
</div>

<style>
  .uv-index {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    border-width: 2px;
    border-style: solid;
    background: rgba(255, 255, 255, 0.06);
  }

  .uv-index__header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .uv-index__value {
    font-size: 2rem;
    font-weight: 700;
  }

  .uv-index__label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .uv-index__description {
    margin: 0;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
  }
</style>
