<template>
  <div class="card shadow-sm mb-4">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">
        Thống kê Bác Sĩ (Tháng {{ month }}/{{ year }})
      </h6>
    </div>
    <div class="card-body">
      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <p v-else-if="!isLoading && bacSiStats.length === 0" class="text-center text-muted">
        Không có dữ liệu bác sĩ cho tháng này.
      </p>
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
            {{ bs.so_benh_nhan_kham_thang }} bệnh nhân / tháng {{ month }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import statisticalService from '../../services/statistical.service'; // Đảm bảo đường dẫn đúng

export default {
  name: 'DoctorStats',
  
  // 1. Định nghĩa props để nhận dữ liệu từ component cha
  props: {
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  
  data() {
    return {
      bacSiStats: [],
      isLoading: false, // Thêm trạng thái loading
    };
  },
  
  // 2. Sử dụng 'watch' để theo dõi sự thay đổi của props
  watch: {
    // Theo dõi cả hai props
    month(newVal, oldVal) {
      // Chỉ gọi lại nếu giá trị thực sự thay đổi VÀ year cũng đã có
      if (newVal !== oldVal && this.year > 0) {
        this.fetchData();
      }
    },
    year(newVal, oldVal) {
      if (newVal !== oldVal && this.month > 0) {
        this.fetchData();
      }
    }
  },

  // 3. Gọi hàm fetch lần đầu khi component được tạo
  // (Lúc này props đã được truyền vào)
  created() {
    // Đảm bảo props đã có giá trị hợp lệ trước khi gọi
    if (this.month > 0 && this.year > 0) {
      this.fetchData();
    }
  },

  methods: {
    async fetchData() {
      // Kiểm tra lần nữa, đề phòng props chưa sẵn sàng
      if (!this.month || !this.year) return;

      this.isLoading = true;
      this.bacSiStats = []; // Xóa dữ liệu cũ
      try {
        // 4. Sử dụng this.month và this.year từ props
        const bacSiStatsRes = await statisticalService.getBacSiStats(
          this.month,
          this.year
        );
        this.bacSiStats = bacSiStatsRes || [];
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
}
</script>

<style scoped>
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

