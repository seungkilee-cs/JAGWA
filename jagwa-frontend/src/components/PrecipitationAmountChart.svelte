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

  function getRainData() {
    return forecasts.map(f => Number((f.rain ?? 0).toFixed(2)));
  }

  function getSnowData() {
    return forecasts.map(f => Number((f.snow ?? 0).toFixed(2)));
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
        datasets: [
          {
            label: 'Rain (mm)',
            data: getRainData(),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(37, 99, 235, 0.8)',
            borderWidth: 1,
            stack: 'precip'
          },
          {
            label: 'Snow (mm)',
            data: getSnowData(),
            backgroundColor: 'rgba(147, 197, 253, 0.6)',
            borderColor: 'rgba(96, 165, 250, 0.8)',
            borderWidth: 1,
            stack: 'precip'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value} mm`,
              color: 'rgba(255, 255, 255, 0.8)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(255, 255, 255, 0.9)'
            }
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
    chart.data.datasets[0].data = getRainData();
    chart.data.datasets[1].data = getSnowData();
    chart.update();
  }
</script>

<div class="chart-wrapper">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-wrapper {
    position: relative;
    width: 100%;
    min-height: 260px;
    margin-top: 1rem;
  }

  canvas {
    max-width: 100%;
  }
</style>
