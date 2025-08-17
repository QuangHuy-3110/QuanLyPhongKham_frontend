<template>
  <div class="container mt-6">
    <h3 class="mb-4 text-center fw-bold">Biểu đồ Thu nhập và Chi tiêu</h3>

    <!-- Bộ lọc -->
    <div class="mb-5">
      <div class="row g-3 align-items-center">
        <div class="col-md-3">
          <select v-model="filter.month" class="form-control" @change="processChartData">
            <option value="">Chọn tháng</option>
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filter.year" class="form-control" @change="processChartData">
            <option value="">Chọn năm</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Biểu đồ tròn -->
    <div v-if="pieChartData.labels.length > 0" class="chart-container mb-5 pie-chart-container">
      <h4 class="text-left mb-1">Tổng Thu nhập và Chi tiêu</h4>
      <canvas ref="pieChart"></canvas>
    </div>
    <div v-else class="text-center mb-5">Không có dữ liệu để hiển thị</div>

    <!-- Biểu đồ kết hợp -->
    <div v-if="combinedChartData.labels.length > 0" class="chart-container mt-5">
      <h4 class="text-center">Biểu đồ Thu nhập và Chi tiêu</h4>
      <canvas ref="combinedChart"></canvas>
    </div>
    <div v-else class="text-center mb-5">Không có dữ liệu để hiển thị</div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  props: {
    lankham: {
      type: Array,
      default: () => [],
    },
    hoadonnhap: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filter: {
        month: '',
        year: new Date().getFullYear().toString(),
      },
      months: [
        { value: '01', label: 'Tháng 1' },
        { value: '02', label: 'Tháng 2' },
        { value: '03', label: 'Tháng 3' },
        { value: '04', label: 'Tháng 4' },
        { value: '05', label: 'Tháng 5' },
        { value: '06', label: 'Tháng 6' },
        { value: '07', label: 'Tháng 7' },
        { value: '08', label: 'Tháng 8' },
        { value: '09', label: 'Tháng 9' },
        { value: '10', label: 'Tháng 10' },
        { value: '11', label: 'Tháng 11' },
        { value: '12', label: 'Tháng 12' },
      ],
      years: Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString()),
      combinedChartData: {
        labels: [],
        datasets: [
          {
            label: 'Thu nhập (Lần khám)',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Chi tiêu (Hóa đơn nhập)',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      pieChartData: {
        labels: ['Thu nhập (Lần khám)', 'Chi tiêu (Hóa đơn nhập)'],
        datasets: [
          {
            data: [],
            backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      combinedChartInstance: null,
      pieChartInstance: null,
    };
  },
  mounted() {
    this.processChartData();
  },
  beforeDestroy() {
    if (this.combinedChartInstance) {
      this.combinedChartInstance.destroy();
    }
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }
  },
  watch: {
    lankham: {
      handler() {
        this.processChartData();
      },
      deep: true,
    },
    hoadonnhap: {
      handler() {
        this.processChartData();
      },
      deep: true,
    },
  },
  methods: {
    processChartData() {
      const lankhamData = this.lankham || [];
      const hoadonnhapData = this.hoadonnhap || [];
      console.log('lankhamData:', lankhamData);
      console.log('hoadonnhapData:', hoadonnhapData);
      const labels = [];
      const revenueData = [];
      const expenseData = [];
      let totalRevenue = 0;
      let totalExpense = 0;

      if (this.filter.month) {
        // Lấy số ngày trong tháng
        const daysInMonth = new Date(parseInt(this.filter.year), parseInt(this.filter.month), 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          labels.push(`${day}/${this.filter.month}`);
        }

        // Khởi tạo mảng doanh thu và chi tiêu
        const revenueByDay = Array(daysInMonth).fill(0);
        lankhamData.forEach(item => {
          if (!item.ngaythangnamkham || item.xoa === 1) return;

          const date = new Date(item.ngaythangnamkham);
          if (isNaN(date)) return;

          const day = date.getDate() - 1;
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear().toString();

          if (month === this.filter.month && year === this.filter.year) {
            const amount = parseFloat(item.tongtien) || 0;
            revenueByDay[day] += amount;
            totalRevenue += amount;
          }
        });

        const expenseByDay = Array(daysInMonth).fill(0);
        hoadonnhapData.forEach(item => {
          if (!item.ngaynhap || item.xoa === 1) return;

          const date = new Date(item.ngaynhap);
          if (isNaN(date)) return;

          const day = date.getDate() - 1;
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear().toString();

          if (month === this.filter.month && year === this.filter.year) {
            const amount = parseFloat(item.tongtien) || 0;
            expenseByDay[day] += amount;
            totalExpense += amount;
          }
        });

        revenueData.push(...revenueByDay);
        expenseData.push(...expenseByDay);
      } else {
        labels.push(...this.months.map(m => m.label));

        const revenueByMonth = Array(12).fill(0);
        lankhamData.forEach(item => {
          if (!item.ngaythangnamkham || item.xoa === 1) return;

          const date = new Date(item.ngaythangnamkham);
          if (isNaN(date)) return;

          const month = date.getMonth();
          const year = date.getFullYear().toString();

          if (year === this.filter.year) {
            const amount = parseFloat(item.tongtien) || 0;
            revenueByMonth[month] += amount;
            totalRevenue += amount;
          }
        });

        const expenseByMonth = Array(12).fill(0);
        hoadonnhapData.forEach(item => {
          if (!item.ngaynhap || item.xoa === 1) return;

          const date = new Date(item.ngaynhap);
          if (isNaN(date)) return;

          const month = date.getMonth();
          const year = date.getFullYear().toString();

          if (year === this.filter.year) {
            const amount = parseFloat(item.tongtien) || 0;
            expenseByMonth[month] += amount;
            totalExpense += amount;
          }
        });

        revenueData.push(...revenueByMonth);
        expenseData.push(...expenseByMonth);
      }

      // Cập nhật dữ liệu biểu đồ cột
      this.combinedChartData.labels = labels;
      this.combinedChartData.datasets[0].data = revenueData;
      this.combinedChartData.datasets[1].data = expenseData;

      // Cập nhật dữ liệu biểu đồ tròn
      this.pieChartData.datasets[0].data = [totalRevenue, totalExpense];

      this.$nextTick(() => {
        this.renderCharts();
      });
    },

    renderCharts() {
      // Vẽ biểu đồ kết hợp
      if (this.combinedChartInstance) {
        this.combinedChartInstance.destroy();
      }
      const combinedCanvas = this.$refs.combinedChart;
      if (combinedCanvas) {
        this.combinedChartInstance = new Chart(combinedCanvas.getContext('2d'), {
          type: 'bar',
          data: this.combinedChartData,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Số tiền (VND)',
                },
              },
              x: {
                title: {
                  display: true,
                  // text: this.filter.month ? 'Ngày trong tháng' : 'Tháng trong năm',
                },
              },
            },
            plugins: {
              legend: {
                display: true, // Tắt chú thích của biểu đồ cột
              },
              title: {
                display: true,
                // text: `Biểu đồ Thu nhập và Chi tiêu ${this.filter.month ? `Tháng ${this.filter.month}/${this.filter.year}` : `Năm ${this.filter.year}`}`,
              },
            },
          },
        });
      }

      // Vẽ biểu đồ tròn
      if (this.pieChartInstance) {
        this.pieChartInstance.destroy();
      }
      const pieCanvas = this.$refs.pieChart;
      if (pieCanvas) {
        this.pieChartInstance = new Chart(pieCanvas.getContext('2d'), {
          type: 'pie',
          data: this.pieChartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                align: 'end', // Căn phải chú thích
                labels: {
                  font: {
                    size: 14, // Tăng kích thước chữ của chú thích
                  },
                  boxWidth: 20, // Kích thước hộp màu trong chú thích
                  padding: 20, // Khoảng cách giữa các mục trong chú thích
                },
              },
              title: {
                display: true,
                // text: `Tổng Thu nhập và Chi tiêu ${this.filter.month ? `Tháng ${this.filter.month}/${this.filter.year}` : `Năm ${this.filter.year}`}`,
                align: 'start',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    const value = context.parsed || 0;
                    label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
                    return label;
                  }
                }
              },
              datalabels: {
                display: true,
                formatter: (value, context) => {
                  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
                },
                color: '#000',
                font: {
                  weight: 'bold',
                  size: 12,
                },
                anchor: 'end',
                align: 'end',
                offset: 10,
              },
            },
          },
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.chart-container {
  max-width: 800px;
  margin: 0 auto;
}

.pie-chart-container {
  max-width: 400px;
  height: 300px;
  margin: 0 auto;
}

.form-control {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>