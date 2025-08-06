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

    <!-- Biểu đồ kết hợp -->
    <div v-if="combinedChartData.labels.length > 0" class="chart-container mb-5">
      <h4 class="text-center mb-3">Biểu đồ Thu nhập và Chi tiêu</h4>
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
      combinedChartInstance: null,
    };
  },
  mounted() {
    this.processChartData();
  },
  beforeDestroy() {
    if (this.combinedChartInstance) {
      this.combinedChartInstance.destroy();
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

      if (this.filter.month) {
        // Lấy số ngày trong tháng
        const daysInMonth = new Date(parseInt(this.filter.year), parseInt(this.filter.month), 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          labels.push(`${day}/${this.filter.month}`);
        }

        // Khởi tạo mảng doanh thu và chi tiêu
        const revenueByDay = Array(daysInMonth).fill(0);
        lankhamData.forEach(item => {
          // Kiểm tra dữ liệu hợp lệ
          if (!item.ngaythangnamkham || item.xoa === 1) return;

          // Chuyển đổi chuỗi ngày ISO thành đối tượng Date
          const date = new Date(item.ngaythangnamkham);
          if (isNaN(date)) return; // Bỏ qua nếu ngày không hợp lệ

          // Lấy ngày, tháng, năm
          const day = date.getDate() - 1; // getDate() trả về 1-31, trừ 1 để khớp với mảng
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Chuẩn hóa thành "01", "02", ...
          const year = date.getFullYear().toString();

          // Chỉ thêm dữ liệu nếu khớp với bộ lọc và không bị xóa
          if (month === this.filter.month && year === this.filter.year) {
            revenueByDay[day] += parseFloat(item.tongtien) || 0;
          }
        });

        const expenseByDay = Array(daysInMonth).fill(0);
        hoadonnhapData.forEach(item => {
          // Kiểm tra dữ liệu hợp lệ
          if (!item.ngaynhap || item.xoa === 1) return;

          // Chuyển đổi chuỗi ngày ISO thành đối tượng Date
          const date = new Date(item.ngaynhap);
          if (isNaN(date)) return; // Bỏ qua nếu ngày không hợp lệ

          const day = date.getDate() - 1;
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear().toString();

          if (month === this.filter.month && year === this.filter.year) {
            expenseByDay[day] += parseFloat(item.tongtien) || 0;
          }
        });

        revenueData.push(...revenueByDay);
        expenseData.push(...expenseByDay);
      } else {
        // Nếu không chọn tháng, hiển thị dữ liệu theo tháng trong năm
        labels.push(...this.months.map(m => m.label));

        const revenueByMonth = Array(12).fill(0);
        lankhamData.forEach(item => {
          if (!item.ngaythangnamkham || item.xoa === 1) return;

          const date = new Date(item.ngaythangnamkham);
          if (isNaN(date)) return;

          const month = date.getMonth(); // getMonth() trả về 0-11
          const year = date.getFullYear().toString();

          if (year === this.filter.year) {
            revenueByMonth[month] += parseFloat(item.tongtien) || 0;
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
            expenseByMonth[month] += parseFloat(item.tongtien) || 0;
          }
        });

        revenueData.push(...revenueByMonth);
        expenseData.push(...expenseByMonth);
      }

      // Cập nhật dữ liệu biểu đồ
      this.combinedChartData.labels = labels;
      this.combinedChartData.datasets[0].data = revenueData;
      this.combinedChartData.datasets[1].data = expenseData;

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
                  text: this.filter.month ? 'Ngày trong tháng' : 'Tháng trong năm',
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: `Biểu đồ Thu nhập và Chi tiêu ${this.filter.month ? `Tháng ${this.filter.month}/${this.filter.year}` : `Năm ${this.filter.year}`}`,
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
.chart-container {
  max-width: 800px;
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