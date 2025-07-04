<template>
  <div class="container">
    <form @submit.prevent="search">
      <div class="row gx-2 gx-md-3 mb-2 align-items-end">
        <!-- Họ và tên -->
        <div class="col-md-4 mb-3 mb-md-0">
          <label class="form-label visually-hidden" for="searchHotenBN">Họ và tên</label>
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="bi-search small"></i>
            </span>
            <input
              v-model="filter.hotenBN"
              type="text"
              class="form-control form-control-sm"
              id="searchHotenBN"
              placeholder="Họ và tên"
              aria-label="Họ và tên"
            >
          </div>
        </div>

        <!-- CCCD -->
        <div class="col-md-4 mb-3 mb-md-0">
          <label class="form-label visually-hidden" for="searchCCCD">CCCD</label>
          <div class="input-group input-group-sm">
            <input
              v-model="filter.cccdBN"
              type="text"
              class="form-control form-control-sm"
              id="searchCCCD"
              placeholder="CCCD"
              aria-label="CCCD"
            >
          </div>
        </div>

        <!-- Địa chỉ -->
        <div class="col-md-4 mb-3 mb-md-0">
          <label class="form-label visually-hidden" for="searchDiachiBN">Địa chỉ</label>
          <div class="input-group input-group-sm">
            <input
              v-model="filter.diachiBN"
              type="text"
              class="form-control form-control-sm"
              id="searchDiachiBN"
              placeholder="Địa chỉ"
              aria-label="Địa chỉ"
            >
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center mt-3">
        <div class="flex-grow-1 d-flex justify-content-center gap-3">
          <button type="button" class="btn btn-warning" @click="reset">
            <i class="fa-solid fa-eraser"></i> Xóa
          </button>
          <button type="submit" class="btn btn-light">
            <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm
          </button>
        </div>
      </div>
    </form>

    <div class="d-flex align-items-center mt-3">
      <div class="ms-auto">
        <button type="button" class="btn btn-secondary" style="margin-right: 25px;" @click="refresh">
          <i class="fa-solid fa-arrow-rotate-right"></i> Làm mới
        </button>
        <button type="button" class="btn btn-success" @click="add_patient">
          <i class="fa-solid fa-plus"></i> Thêm bệnh nhân mới
        </button>
      </div>
    </div>
  </div>
  <hr>
</template>

<script>
export default {
  emits: ['add:patient', 'filter:patient', 'refresh:patient'],

  data() {
    return {
      filter: {
        hotenBN: '',
        cccdBN: '',
        diachiBN: ''
      }
    };
  },

  methods: {
    add_patient() {
      this.$emit('add:patient', 'add_patient');
    },

    search() {
      // Phát sự kiện filter:patient với bộ lọc
      this.$emit('filter:patient', { ...this.filter });
    },

    reset() {
      // Đặt lại form
      this.filter = {
        hotenBN: '',
        cccdBN: '',
        diachiBN: ''
      };
      // Phát sự kiện filter:patient với bộ lọc rỗng
      this.$emit('filter:patient', { ...this.filter });
    },

    refresh() {
      // Phát sự kiện refresh để khôi phục danh sách gốc
      this.reset();
      this.$emit('refresh:patient');
    }
  }
}
</script>

<style scoped>
.container {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 32px;
  padding-bottom: 0px;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    gap: 10px;
  }

  .flex-grow-1 {
    justify-content: start !important;
  }

  .ms-auto {
    margin-left: 0 !important;
  }
}
</style>