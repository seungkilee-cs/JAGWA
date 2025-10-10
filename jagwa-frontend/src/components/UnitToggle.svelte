<script lang="ts">
  import { unit, toggleUnit } from '../lib/stores/weatherStore';
</script>

<button 
  class="unit-toggle"
  on:click={toggleUnit}
  aria-label="Toggle temperature unit"
>
  <span class="unit {$unit === 'celsius' ? 'active' : ''}">°C</span>
  <span class="divider">/</span>
  <span class="unit {$unit === 'fahrenheit' ? 'active' : ''}">°F</span>
</button>

<style>
  .unit-toggle {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 0.375rem 0.75rem;
    color: white;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
    backdrop-filter: blur(20px);
  }
  
  .unit-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .unit {
    opacity: 0.6;
    transition: opacity 0.2s;
    font-weight: 500;
  }
  
  .unit.active {
    opacity: 1;
    font-weight: 600;
  }
  
  .divider {
    opacity: 0.4;
    font-weight: 300;
  }
</style>
