```vue
<template>
  <div class="prescription-container">
    <h2 class="mb-4 text-center">Xem Toa Thuốc</h2>
    <div class="d-flex justify-content-center">
      <button type="button" class="btn btn-primary" @click="openPreviewModal">Xem toa thuốc</button>
    </div>

    <!-- Modal xem toa thuốc -->
    <div
      class="modal fade"
      id="previewModal"
      tabindex="-1"
      aria-labelledby="previewModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="previewModalLabel">Chi tiết Toa Thuốc</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h6>Thông tin bệnh nhân</h6>
            <p><strong>Họ và tên:</strong> {{ patient.hotenBN }}</p>
            <p><strong>Ngày tháng năm sinh:</strong> {{ patient.ngaysinhBN }}</p>
            <p><strong>Chẩn đoán:</strong> {{ selectedExamination.chuandoan }}</p>
            <h6 class="mt-4">Danh sách thuốc</h6>
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Tên thuốc</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Đơn vị</th>
                  <th scope="col">Liều dùng</th>
                  <th scope="col">Thời gian</th>
                  <th scope="col">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(medicine, index) in list_prescription" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ medicine.maThuoc }}</td>
                  <td>{{ medicine.soluong }}</td>
                  <td>{{ medicine.donvi }}</td>
                  <td>{{ medicine.lieuluong }}</td>
                  <td>{{ medicine.thoigianSD }}</td>
                  <td>{{ medicine.thanhtien }}</td>
                </tr>
              </tbody>
            </table>
            <h6>Chi phí khám bệnh: 60.000</h6>
            <h5>Tổng tiền: {{ selectedExamination.tongtien }}</h5>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  props: {
    selectedExamination: {type: Object, required: true},
    patient:{type: Object, required: true},
    list_prescription: {type: Array}
  },

  data() {
    return {
      previewModal: null,
    };
  },
  mounted() {
    this.previewModal = new Modal(document.getElementById('previewModal'));
  },
  methods: {
    openPreviewModal() {
      this.previewModal.show();
    },
  },
};
</script>

<style scoped>
.prescription-container {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
```