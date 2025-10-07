<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { HourlyForecast } from '../lib/services/weatherService';

  export let forecasts: HourlyForecast[];

  let chart: Chart | null = null;
  let canvas: HTMLCanvasElement;

  function getLabels() {
    return forecasts.map(f => new Date(f.time).toLocaleTimeString([], { hour: '2-digit' }));
  }

  function getData() {
    return forecasts.map(f => f.precipitation);
  }

  function renderChart() {
    if (!canvas) return;

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: getLabels(),
        datasets: [{
          label: 'Precipitation Probability',
          data: getData(),
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
  }

  onMount(() => {
    Chart.register(...registerables);
    renderChart();

    return () => {
      chart?.destroy();
      chart = null;
    };
  });

  $: if (chart) {
    chart.data.labels = getLabels();
    chart.data.datasets[0].data = getData();
    chart.update();
  }
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    max-width: 100%;
    margin-top: 1rem;
  }
</style>
