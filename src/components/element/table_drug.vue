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
            <p><strong>Ngày tháng năm sinh:</strong> {{ formatValue(patient.ngaysinhBN) }}</p>
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
                  <!-- <td>{{ medicine.maThuoc }}</td> -->
                  <td>{{ getDrugName(medicine.maThuoc) }}</td>
                  <td>{{ medicine.soluong }}</td>
                  <td>{{ medicine.donvi }}</td>
                  <td>{{ medicine.lieuluong }}</td>
                  <td>{{ medicine.thoigianSD }}</td>
                  <td>{{ formatValue(medicine.thanhtien, 'thanhtien') }}</td>
                </tr>
              </tbody>
            </table>
            <h6>Chi phí khám bệnh: 60.000</h6>
            <h5>Tổng tiền: {{ formatValue(selectedExamination.tongtien, 'tongtien') }}</h5>
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
import DrugService from "../../services/drug.service"; // [Cite: drug.service.js] Import file service của bạn

export default {
  props: {
    selectedExamination: {type: Object, required: true},
    patient: {type: Object, required: true},
    list_prescription: {type: Array}
  },

  data() {
    return {
      previewModal: null,
      drugs: [], // Biến để lưu danh sách tất cả thuốc lấy từ DB
    };
  },
  
  methods: {
    // 1. Hàm lấy danh sách tất cả thuốc
    async retrieveDrugs() {
      try {
        // Gọi hàm getAll từ DrugService bạn đã cung cấp
        this.drugs = await DrugService.getAll(); 
      } catch (error) {
        console.log("Lỗi khi tải danh sách thuốc: ", error);
      }
    },

    // 2. Hàm tìm Tên thuốc dựa vào Mã thuốc
    getDrugName(maThuoc) {
        // Tìm thuốc trong danh sách drugs có _id hoặc maThuoc trùng khớp
        const drug = this.drugs.find(d => d._id === maThuoc || d.maThuoc === maThuoc);
        
        // Nếu tìm thấy thì trả về tên, nếu không thì trả về mã gốc
        return drug ? drug.tenThuoc : maThuoc;
    },

    openPreviewModal() {
      this.previewModal.show();
    },

    formatValue(value, key) {
      if (!value) return 'N/A';
      if (
        typeof value === 'string' &&
        (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value) || /\d{4}-\d{2}-\d{2}/.test(value))
      ) {
        const date = new Date(value);
        if (!isNaN(date)) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      }
      if (key === 'tongtien' || key === 'thanhtien' || key === 'dongia') {
        return Number(value).toLocaleString('vi-VN');
      }
      return value;
    },
  },
  
  mounted() {
    this.previewModal = new Modal(document.getElementById('previewModal'));
    
    // Gọi hàm lấy dữ liệu thuốc ngay khi component được tải
    this.retrieveDrugs();
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