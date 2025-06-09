<template>
  <!-- List Directory -->
  <div class="container">
    <!-- Form -->
    <form>
      <div class="row gx-2 gx-md-3 mb-2 align-items-end">
        <!-- Search job -->
        <div class="col-md-4 mb-3 mb-md-0">
          <label class="form-label visually-hidden" for="searchJobCareers1">Search job</label>
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="bi-search small"></i>
            </span>
            <input
              type="text"
              class="form-control form-control-sm"
              id="searchJobCareers1"
              placeholder="Họ và tên"
              aria-label="Search job"
            >
          </div>
        </div>

        <!-- Location -->
        <div class="col-md-4 mb-3 mb-md-0">
          <label class="form-label visually-hidden" for="searchJobCareers2">Search job</label>
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control form-control-sm"
              id="searchJobCareers2"
              placeholder="CCCD"
              aria-label="Search job"
            >
          </div>
        </div>

        <!-- Department -->
        <div class="col-md-4 mb-3 mb-md-0">
          <label class="form-label visually-hidden" for="searchJobCareers3">Search job</label>
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control form-control-sm"
              id="searchJobCareers3"
              placeholder="Địa chỉ"
              aria-label="Search job"
            >
          </div>
        </div>
      </div>
      <!-- End Row -->
      <div class="d-flex align-items-center mt-3">
        <div class="flex-grow-1 d-flex justify-content-center gap-3">
          <button type="reset" class="btn btn-warning">
              <i class="fa-solid fa-eraser"></i> Xóa
          </button>
          <button type="button" class="btn btn-light">
            <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm
          </button>
      </div>
      </div>
    </form>
    <!-- End Form -->

    <!-- Buttons -->
     <!-- add profile_patient -->
     <div class="d-flex align-items-center mt-3">
            <div class="ms-auto">
                <button type="button" class="btn btn-secondary" style="margin-right: 25px;">
                <i class="fa-solid fa-arrow-rotate-right"></i> Làm mới
                </button>

                <button type="button" class="btn btn-success" @click="add_patient">
                <i class="fa-solid fa-plus"></i> Thêm bệnh nhân mới
                </button>
            </div>
      </div>
  </div>
  <hr>

  <!-- End List Directory -->
</template>

<script>

  export default{

    emits : ['add:patient'],

  props : {

  },

  components: {
  },

  methods: {
      add_patient (){
          this.$emit('add:patient', "add_patient")
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