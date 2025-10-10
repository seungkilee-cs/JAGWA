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

<div class="uv-index">
  <div class="uv-header">
    <div class="uv-icon">☀️</div>
    <div class="uv-title">UV Index</div>
  </div>
  <div class="uv-value" style={`color: ${currentLevel.color};`}>{uvi.toFixed(1)}</div>
  <div class="uv-label" style={`color: ${currentLevel.color};`}>{currentLevel.label}</div>
  <p class="uv-description">{currentLevel.description}</p>
</div>

<style>
  .uv-index {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    padding: 1rem;
    color: white;
    text-align: center;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .uv-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .uv-icon {
    font-size: 1rem;
  }

  .uv-title {
    font-size: 0.75rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  .uv-value {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0.25rem;
  }

  .uv-label {
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .uv-description {
    margin: 0;
    font-size: 0.7rem;
    opacity: 0.7;
    line-height: 1.3;
  }
</style>
