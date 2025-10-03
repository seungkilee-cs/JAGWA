<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { HourlyForecast } from '../lib/services/weatherService';
  
  export let forecasts: HourlyForecast[];
  
  let chart: Chart;
  let canvas: HTMLCanvasElement;
  
  onMount(() => {
    Chart.register(...registerables);
    
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: forecasts.map(f => new Date(f.time).toLocaleTimeString([], { hour: '2-digit' })),
        datasets: [{
          label: 'Precipitation Probability',
          data: forecasts.map(f => f.precipitation),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value) => `${value}%` }
          }
        }
      }
    });
    
    return () => chart.destroy();
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    max-width: 100%;
    margin-top: 1rem;
  }
</style>
