<template>
  <div class="chart-container" style=" position: relative;">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
 import Chart from 'chart.js/auto'

export default {
  name: 'SubjectScoresBarChart',
  props: {
    scores: {
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
    scores: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')

      // Destroy existing chart if any
      if (this.chartInstance) {
        this.chartInstance.destroy()
      }

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: this.getChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Average Scores by Subject'
            },
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Score (%)'
              }
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
        labels: this.scores.map(item => item.subject),
        datasets: [{
          label: 'Average Score (%)',
          backgroundColor: '#21ba45',
          borderColor: '#198f35',
          borderWidth: 1,
          data: this.scores.map(item => item.avgScore)
        }]
      }
    }
  }
}
</script>

