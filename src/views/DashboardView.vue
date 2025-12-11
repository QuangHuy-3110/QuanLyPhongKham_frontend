<template>
  <div class="dashboard-container p-4">
    <h2 class="mb-4 text-center fw-bold">Tổng Quan Hệ Thống</h2>
    <hr>
    <div class="row">
      <!-- Widget Tổng số bệnh nhân và kích hoạt -->
      <div class="col-xl-3 col-md-6 mb-4">
        <DashboardWidget
          title="Tổng Bệnh Nhân"
          :value="benhNhanStats.total"
          :description="`${benhNhanStats.active} đã kích hoạt`"
          color="primary"
        >
          <template #icon><i class="fas fa-users"></i></template>
        </DashboardWidget>
      </div>

      <!-- Widget Lịch hẹn chưa khám -->
      <div class="col-xl-3 col-md-6 mb-4">
        <DashboardWidget
          title="Lịch Hẹn Chờ Khám"
          :value="lichHenChuaKham"
          description="Các lịch hẹn chưa được xử lý"
          color="warning"
        >
          <template #icon><i class="fas fa-calendar-alt"></i></template>
        </DashboardWidget>
      </div>

      <!-- Widget Hồ sơ khám bệnh -->
      <div class="col-xl-3 col-md-6 mb-4">
        <DashboardWidget
          title="Hồ Sơ Khám Bệnh"
          :value="hoSoKhamBenh"
          description="Tổng số hồ sơ đã tạo"
          color="success"
        >
          <template #icon><i class="fas fa-notes-medical"></i></template>
        </DashboardWidget>
      </div>

      <!-- Widget Số lượng bác sĩ -->
      <div class="col-xl-3 col-md-6 mb-4">
        <DashboardWidget
          title="Tổng Số Bác Sĩ"
          :value="soLuongBacSi"
          description="Tổng số bác sĩ trong hệ thống"
          color="info"
        >
          <template #icon><i class="fas fa-user-md"></i></template>
        </DashboardWidget>
      </div>
    </div>

    <div class="row">
       <!-- Biểu đồ thống kê Thu Chi Hàng Tháng -->
      <div class="col-lg-6 mb-4">
        <!-- ⭐ TRUYỀN DỮ LIỆU THU CHI HÀNG THÁNG VÀ ĐẶT ID KHÁC BIỆT ⭐ -->
        <ThuChiChart :title="`Thống kê Thu Chi (Năm ${currentYear})`" chartId="monthlyThuChiChart" :chartData="thuChiChartDataMonthly" />
      </div>

      <!-- Biểu đồ thống kê Thu Chi Hàng Ngày -->
      <div class="col-lg-6 mb-4">
         <!-- ⭐ TRUYỀN DỮ LIỆU THU CHI HÀNG NGÀY VÀ ĐẶT ID KHÁC BIỆT ⭐ -->
        <ThuChiChart :title="`Thống kê Thu Chi (Tháng ${currentMonth})`" chartId="dailyThuChiChart" :chartData="thuChiChartDataDaily" />
      </div>


      <!-- Thống kê Bác sĩ (có thể làm dạng bảng hoặc biểu đồ nhỏ) -->
      <div class="col-lg-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Thống kê Bác Sĩ</h6>
          </div>
          <div class="card-body">
            <p v-if="bacSiStats.length === 0" class="text-center text-muted">Không có dữ liệu bác sĩ.</p>
            <ul class="list-group list-group-flush" v-else>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
                v-for="(bs, index) in bacSiStats"
                :key="index"
              >
                {{ bs.tenBS }}
                <span class="badge bg-primary rounded-pill">
                  {{ bs.so_buoi_lam_thuc_te_thang }} / {{ bs.so_buoi_lich_thang }} ngày
                </span>

                <span class="badge bg-warning rounded-pill">
                  {{ bs.so_benh_nhan_kham_thang }} bệnh nhân / tháng {{currentMonth}}
                </span>

                
              </li>
            </ul>
            <div v-if="bacSiStats.length > 0" class="mt-3">
                 <small class="text-muted">Chi tiết hơn có thể xem ở trang Quản lý Bác sĩ.</small>
            </div>
          </div>
          
        </div>
       
      </div>
       <!-- <AdminLeads/> -->
    </div>
  </div>
</template>

<script>
import DashboardWidget from '../components/DashboardWidget.vue';
import ThuChiChart from '../components/ThuChiChart.vue';
import statisticalService from '../services/statistical.service'; // Import service của bạn
import AdminLeads from '../components/admin/AdminLeads.vue';

export default {
  name: 'DashboardView',
  components: {
    DashboardWidget,
    ThuChiChart,
    AdminLeads,
  },
  data() {
    return {
      benhNhanStats: { total: 0, active: 0 },
      lichHenChuaKham: 0,
      hoSoKhamBenh: 0,
      soLuongBacSi: 0,
      thuChiStats: [],
      bacSiStats: [],
      rawThuChiDailyStats: [], // Thêm thuộc tính này để lưu trữ dữ liệu thô
      rawThuChiMonthlyStats: [], // Thêm thuộc tính này để lưu trữ dữ liệu thô
      thuChiChartDataDaily: {
        labels: [],
        datasets: [[], []],
      },
      thuChiChartDataMonthly: {
        labels: [],
        datasets: [[], []],
      },
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    currentMonth() {
      return new Date().getMonth() + 1; // getMonth() trả về 0-11, nên cộng thêm 1
    }
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // 1. Thống kê bệnh nhân
        const benhNhanRes = await statisticalService.getBenhNhanStats();
        this.benhNhanStats = {
          total: benhNhanRes.total_benhnhan || 0,
          active: benhNhanRes.activated_benhnhan || 0,
        };

        // 2. Lịch hẹn chưa khám
        const lichHenRes = await statisticalService.getLichHenChuaKham();
        this.lichHenChuaKham = lichHenRes.so_lichhen_chuakham || 0;

        // 3. Hồ sơ khám bệnh
        const hoSoRes = await statisticalService.getHoSoKhamBenh();
        this.hoSoKhamBenh = hoSoRes.so_hoso || 0;

        // 4. Số lượng bác sĩ
        const bacSiCountRes = await statisticalService.getSoLuongBacSi();
        this.soLuongBacSi = bacSiCountRes.so_bacsi || 0;

        // 5. Thống kê thu chi
        const thuChiRes = await statisticalService.getThuChiStats();
        
        if (thuChiRes && thuChiRes.data) {
            this.rawThuChiDailyStats = Array.isArray(thuChiRes.data.dailyStats) ? thuChiRes.data.dailyStats : [];
            this.rawThuChiMonthlyStats = Array.isArray(thuChiRes.data.monthlyStats) ? thuChiRes.data.monthlyStats : [];
        } else {
            this.rawThuChiDailyStats = [];
            this.rawThuChiMonthlyStats = [];
        }
        
        // ⭐ GỌI HÀM XỬ LÝ DỮ LIỆU CHO CẢ HAI LOẠI BIỂU ĐỒ ⭐
        this.processThuChiDataForChart(this.rawThuChiDailyStats, 'daily');
        this.processThuChiDataForChart(this.rawThuChiMonthlyStats, 'monthly');

        // 6. Thống kê từng bác sĩ
        const bacSiStatsRes = await statisticalService.getBacSiStats();
        console.log(bacSiStatsRes)
        this.bacSiStats = bacSiStatsRes || [];

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
        // Có thể hiển thị thông báo lỗi cho người dùng
      }
    },
    // ⭐ CẬP NHẬT HÀM XỬ LÝ DỮ LIỆU ĐỂ NHẬN THÊM LOẠI BIỂU ĐỒ ⭐
    processThuChiDataForChart(data, type) {
      const fullLabels = this.generateLabels(data, type); 

      if (fullLabels.length === 0 && (!Array.isArray(data) || data.length === 0)) {
        // Fallback nếu không tạo được fullLabels (rất hiếm xảy ra với logic mới)
        if (type === 'daily') {
          this.thuChiChartDataDaily = { labels: [], datasets: [[], []] };
        } else {
          this.thuChiChartDataMonthly = { labels: [], datasets: [[], []] };
        }
        return;
      }
      
      const labelKey = (type === 'daily') ? 'ngay' : 'thang';
      
      const thuData = fullLabels.map(label => {
        // Chuyển đổi labelKey từ API về dạng chuỗi để so sánh đồng nhất
        // Ví dụ: item.thang (số 7) vs label (số 7) -> chuyển cả 2 về chuỗi "7"
        const item = data.find(d => String(d[labelKey]) === String(label));
        return item ? parseFloat(item.tong_thu) : 0;
      });
      const chiData = fullLabels.map(label => {
        const item = data.find(d => String(d[labelKey]) === String(label));
        return item ? parseFloat(item.tong_chi) : 0;
      });

      const chartFormattedData = {
        labels: fullLabels,
        datasets: [
          thuData,
          chiData,
        ],
      };

      if (type === 'daily') {
        this.thuChiChartDataDaily = chartFormattedData;
      } else {
        this.thuChiChartDataMonthly = chartFormattedData;
      }
    },

    // Hàm mới để tạo chuỗi các ngày/tháng
    generateLabels(data, type) {
        const today = new Date();
        
        if (type === 'daily') {
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth(); // 0-11
            const numDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Số ngày trong tháng

            const allDates = [];
            for (let i = 1; i <= numDaysInMonth; i++) {
                const date = new Date(currentYear, currentMonth, i);
                allDates.push(date.toISOString().slice(0, 10)); // YYYY-MM-DD
            }
            return allDates;

        } else { // monthly
            const allMonths = [];
            for (let i = 1; i <= 12; i++) { // Từ tháng 1 đến tháng 12
                allMonths.push(i);
            }
            return allMonths.sort((a,b) => a-b);
        }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #343a40;
  font-weight: 600;
}

/* Các style chung cho card đã được định nghĩa trong DashboardWidget */
.card-header {
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
}
.font-weight-bold {
  font-weight: 700 !important;
}
.text-primary {
  color: #007bff !important;
}

.list-group-item {
  border-left: none;
  border-right: none;
}
.list-group-item:first-child {
    border-top: none;
}
.list-group-item:last-child {
    border-bottom: none;
}
</style>