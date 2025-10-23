<template>
  <div class="card shadow-sm mb-4">
    <div class="card-header py-3">
      <!-- ⭐ HIỂN THỊ TITLE TỪ PROP ⭐ -->
      <h6 class="m-0 font-weight-bold text-primary">{{ title }}</h6> 
    </div>

    <div class="card-body">
      <!-- ⭐ CANVAS CÓ CHIỀU CAO CỤ THỂ ⭐ -->
      <div class="chart-container">
        <canvas :id="chartId" :ref="chartId"></canvas> 
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'ThuChiChart',
  props: {
    title: { // ⭐ THÊM PROP TITLE ⭐
      type: String,
      required: true,
    },
    chartId: { // ⭐ THÊM PROP CHARTID ⭐
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
      default: () => ({
        labels: [],
        datasets: [],
      }),
    },
  },
  data() {
    return {
      thuChiChart: null,
    };
  },
  watch: {
    chartData: {
      handler(newData) {
        // ⭐ Sử dụng chartId để truy cập canvas ⭐
        const canvasRef = this.$refs[this.chartId];
        if (newData && newData.labels && newData.labels.length > 0 && canvasRef) {
          this.renderChart(newData);
        } else if (this.thuChiChart) {
          this.thuChiChart.destroy();
          this.thuChiChart = null;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    renderChart(data) {
      // ⭐ Sử dụng chartId để truy cập canvas ⭐
      const canvas = this.$refs[this.chartId];
      if (!canvas) {
        console.warn(`Canvas element with ref ${this.chartId} not found for chart.`);
        return;
      }

      if (this.thuChiChart) {
        this.thuChiChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      this.thuChiChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Thu',
              backgroundColor: 'rgba(40, 167, 69, 0.8)',
              borderColor: 'rgba(40, 167, 69, 1)',
              data: data.datasets[0] || [],
            },
            {
              label: 'Chi',
              backgroundColor: 'rgba(220, 53, 69, 0.8)',
              borderColor: 'rgba(220, 53, 69, 1)',
              data: data.datasets[1] || [],
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  beforeUnmount() {
    if (this.thuChiChart) {
      this.thuChiChart.destroy();
    }
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px; /* 👈 Tăng chiều cao nội dung ở đây */
}

.card-body {
  padding: 1rem 1.25rem;
}
</style>