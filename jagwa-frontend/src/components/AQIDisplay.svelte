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

<div class="aqi-display" style="background-color: {currentLevel.color};">
  AQI: {currentLevel.label}
</div>

<style>
  .aqi-display {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: bold;
    margin-top: 1rem;
    text-align: center;
  }
</style>
