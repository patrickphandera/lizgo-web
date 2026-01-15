<template>
  <div class="chart-container q-pa-xs" style="position: relative;">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
// Only needed if you're using npm-installed Chart.js
// If using CDN, remove this import — `Chart` is global
import Chart from 'chart.js/auto'


export default {
  name: 'ProgressOverTimeChart',
  props: {
    // Expected format: [{ date: '2026-01-01', avgScore: 85 }, ...]
    progressData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  },
  watch: {
    progressData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')

      if (this.chartInstance) {
        this.chartInstance.destroy()
      }

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: this.getChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Overall Progress Over Time'
            },
            legend: {
              display: false // optional: hide legend if only one dataset
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            },
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Average Score (%)'
              }
            }
          },
          elements: {
            point: {
              radius: 4,
              hoverRadius: 6
            },
            line: {
              tension: 0.3, // smooth curve (set to 0 for straight lines)
              borderWidth: 3
            }
          }
        }
      })
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.data = this.getChartData()
        this.chartInstance.update()
      }
    },
    getChartData() {
      return {
        labels: this.progressData.map(item => this.formatDate(item.date)),
        datasets: [
          {
            label: 'Average Score',
            data: this.progressData.map(item => item.avgScore),
            borderColor: '#21ba45',
            backgroundColor: 'rgba(33, 186, 69, 0.1)',
            fill: true, // fills area under the line
            tension: 0.3
          }
        ]
      }
    },
    formatDate(dateString) {
      // Format ISO date or string to readable form
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>

</style>
