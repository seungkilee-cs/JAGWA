<script lang="ts">
  export let aqi: number;
  
  const aqiLevels = [
    { level: 1, label: 'Good', color: 'green' },
    { level: 2, label: 'Fair', color: 'yellow' },
    { level: 3, label: 'Moderate', color: 'orange' },
    { level: 4, label: 'Poor', color: 'red' },
    { level: 5, label: 'Very Poor', color: 'purple' }
  ];
  
  const currentLevel = aqiLevels.find(level => level.level === aqi) || aqiLevels[0];
</script>

<div class="aqi-display">
  <div class="aqi-header">
    <div class="aqi-icon">🌬️</div>
    <div class="aqi-title">Air Quality</div>
  </div>
  <div class="aqi-value" style="color: {currentLevel.color};">{aqi}</div>
  <div class="aqi-label" style="color: {currentLevel.color};">{currentLevel.label}</div>
</div>

<style>
  .aqi-display {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    padding: 1rem;
    color: white;
    text-align: center;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .aqi-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .aqi-icon {
    font-size: 1rem;
  }

  .aqi-title {
    font-size: 0.75rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  .aqi-value {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0.25rem;
  }

  .aqi-label {
    font-size: 0.85rem;
    font-weight: 500;
  }
</style>
