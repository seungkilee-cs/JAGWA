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
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
  }
  
  .unit-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .unit {
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  
  .unit.active {
    opacity: 1;
    font-weight: bold;
  }
  
  .divider {
    opacity: 0.6;
  }
</style>
