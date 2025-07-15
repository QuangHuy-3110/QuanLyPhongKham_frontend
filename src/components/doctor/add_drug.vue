<template>
    <!-- Thông tin bệnh nhân -->
    <div class="card mb-4">
      <div class="card-header">Thông tin bệnh nhân</div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="patientName" class="form-label">Họ và tên</label>
            <input
              type="text"
              class="form-control"
              id="patientName"
              v-model="patient.hotenBN"
              required
              disabled
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="patientAge" class="form-label">Năm sinh</label>
            <input
              type="text"
              class="form-control"
              id="patientAge"
              v-model="patient.ngaysinhBN"
              required
              disabled
            />
          </div>
        </div>
        <div class="mb-3">
          <label for="diagnosis" class="form-label">Chẩn đoán</label>
          <textarea
            class="form-control"
            id="diagnosis"
            rows="3"
            v-model="selectedExamination.chuandoan"
            required
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  
    <!-- Danh sách thuốc -->
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        Danh sách thuốc
        <button type="button" class="btn btn-primary btn-sm" @click="addMedicineRow">
          Thêm thuốc
        </button>
      </div>
      <div class="card-body" id="medicineList">
        <div class="medicine-row row align-items-center" v-for="(medicine, index) in medicines" :key="index">
          <div class="col-12 col-md-3 mb-2 mb-md-0 position-relative">
            <input
              type="text"
              class="form-control"
              placeholder="Tên thuốc"
              v-model="medicine.name"
              @input="searchDrugs(index, $event)"
              @focus="showSuggestions(index)"
              required
            />
            <ul v-if="medicine.showSuggestions && filteredDrugs[index]?.length" class="suggestions-list">
              <li
                v-for="drug in filteredDrugs[index]"
                :key="drug.maThuoc"
                @click="selectDrug(index, drug)"
              >
                {{ drug.tenThuoc }}
              </li>
            </ul>
          </div>
          <div class="col-12 col-md-2 mb-2 mb-md-0">
            <input
              type="number"
              class="form-control"
              placeholder="Số lượng"
              v-model="medicine.quantity"
              required
            />
          </div>
          <div class="col-12 col-md-2 mb-2 mb-md-0">
            <select class="form-select" v-model="medicine.unit" required>
              <option value="">Đơn vị</option>
              <option v-for="unit in uniqueUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
          <div class="col-12 col-md-2 mb-2 mb-md-0">
            <input
              type="text"
              class="form-control"
              placeholder="Liều dùng"
              v-model="medicine.dosage"
              required
            />
          </div>
          <div class="col-12 col-md-2 mb-2 mb-md-0">
            <input
              type="text"
              class="form-control"
              placeholder="Thời gian"
              v-model="medicine.time"
              required
            />
          </div>
          <div class="col-12 col-md-1 mb-2 mb-md-0">
            <button
              type="button"
              class="btn btn-danger btn-sm w-100"
              @click="removeMedicineRow(index)"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Ghi chú và nút hành động -->
    <div class="d-flex justify-content-end gap-2">
      <button type="submit" class="btn btn-primary" @click="openPreviewModal()">Xem toa thuốc</button>
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
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="previewModalLabel">Xem Toa Thuốc</h5>
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
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Mã thuốc</th>
                    <th scope="col">Tên thuốc</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Đơn vị</th>
                    <th scope="col">Liều dùng</th>
                    <th scope="col">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(medicine, index) in medicines" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ medicine.maThuoc || 'N/A' }}</td>
                    <td>{{ medicine.name }}</td>
                    <td>{{ medicine.quantity }}</td>
                    <td>{{ medicine.unit }}</td>
                    <td>{{ medicine.dosage }}</td>
                    <td>{{ medicine.time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
              <button type="button" class="btn btn-primary" @click="savePrescription">
                Xác nhận lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import prescriptionService from '../../services/prescription.service';
import drugService from '../../services/drug.service';
import WebSocketService from '../../services/ws.service';

export default {
  props: {
    selectedExamination: { type: Object, required: true },
    patient: { type: Object, required: true },
    doctor: { type: Object, required: true },
  },
  data() {
    return {
      wsSocket: new WebSocketService(),
      medicines: [
        {
          maThuoc: '',
          name: '',
          quantity: null,
          unit: '',
          dosage: '',
          time: '',
          showSuggestions: false,
        },
      ],
      filteredDrugs: [],
      allDrugs: [],
      uniqueUnits: [], // Danh sách các đơn vị duy nhất
      previewModal: null,
    };
  },

  methods: {
    async loadDrugs() {
      try {
        const response = await drugService.getAll();
        this.allDrugs = response;
        // Tạo danh sách đơn vị duy nhất từ donvitinhThuoc
        this.uniqueUnits = [...new Set(this.allDrugs.map(drug => drug.donvitinhThuoc).filter(unit => unit))];
        this.filteredDrugs = this.medicines.map(() => []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách thuốc:', error);
        alert('Không thể tải danh sách thuốc. Vui lòng thử lại.');
      }
    },

    searchDrugs(index, event) {
      const query = event.target.value.toLowerCase();
      this.medicines[index].showSuggestions = true;
      if (query) {
        this.filteredDrugs[index] = this.allDrugs.filter((drug) =>
          drug.tenThuoc.toLowerCase().includes(query)
        );
      } else {
        this.filteredDrugs[index] = [];
      }
      this.$set(this.filteredDrugs, index, this.filteredDrugs[index]);
    },

    selectDrug(index, drug) {
      this.medicines[index].maThuoc = drug.maThuoc;
      this.medicines[index].name = drug.tenThuoc;
      this.medicines[index].unit = drug.donvitinhThuoc || '';
      this.medicines[index].showSuggestions = false;
      this.filteredDrugs[index] = [];
    },

    showSuggestions(index) {
      this.medicines[index].showSuggestions = true;
      this.filteredDrugs[index] = this.allDrugs;
    },

    addMedicineRow() {
      this.medicines.push({
        maThuoc: '',
        name: '',
        quantity: null,
        unit: '',
        dosage: '',
        time: '',
        showSuggestions: false,
      });
      this.filteredDrugs.push([]);
    },

    removeMedicineRow(index) {
      if (this.medicines.length > 1) {
        this.medicines.splice(index, 1);
        this.filteredDrugs.splice(index, 1);
      } else {
        alert('Phải có ít nhất một loại thuốc!');
      }
    },

    resetForm() {
      this.medicines = [
        {
          maThuoc: '',
          name: '',
          quantity: null,
          unit: '',
          dosage: '',
          time: '',
          showSuggestions: false,
        },
      ];
      this.filteredDrugs = [[]];
    },

    openPreviewModal() {
      // Kiểm tra dữ liệu trước khi mở modal
      for (const medicine of this.medicines) {
        if (!medicine.maThuoc || !medicine.name || !medicine.quantity || !medicine.unit || !medicine.dosage || !medicine.time) {
          alert('Vui lòng điền đầy đủ thông tin cho tất cả các thuốc!');
          return;
        }
        if (medicine.quantity <= 0) {
          alert('Số lượng thuốc phải lớn hơn 0!');
          return;
        }
        // Kiểm tra số lượng thuốc trong kho
        const thuoc = this.allDrugs.find(drug => drug.maThuoc === medicine.maThuoc);
        if (!thuoc) {
          alert(`Không tìm thấy thuốc ${medicine.name} trong kho!`);
          return;
        }
        if (medicine.quantity > thuoc.soluongThuoc) {
          alert(`Số lượng thuốc ${medicine.name} không đủ trong kho! Chỉ còn ${thuoc.soluongThuoc} ${thuoc.donvitinhThuoc}.`);
          return;
        }
        // Kiểm tra liều dùng phải nhỏ hơn số lượng
        const dosageValue = parseFloat(medicine.dosage);
        if (isNaN(dosageValue) || dosageValue <= 0) {
          alert(`Liều dùng của thuốc ${medicine.name} phải là một số dương!`);
          return;
        }
        if (dosageValue >= medicine.quantity) {
          alert(`Liều dùng của thuốc ${medicine.name} phải nhỏ hơn số lượng (${medicine.quantity} ${medicine.unit})!`);
          return;
        }
      }
      this.previewModal.show();
    },

    async savePrescription() {
      try {
        for (const medicine of this.medicines) {
          // Kiểm tra số lượng thuốc trong kho và liều dùng trước khi lưu
          const thuoc = this.allDrugs.find(drug => drug.maThuoc === medicine.maThuoc);
          if (!thuoc) {
            alert(`Không tìm thấy thuốc ${medicine.name} trong kho!`);
            throw new Error(`Không tìm thấy thuốc ${medicine.maThuoc} trong allDrugs`);
          }
          if (medicine.quantity > thuoc.soluongThuoc) {
            alert(`Số lượng thuốc ${medicine.name} không đủ trong kho! Chỉ còn ${thuoc.soluongThuoc} ${thuoc.donvitinhThuoc}.`);
            throw new Error(`Số lượng thuốc ${medicine.maThuoc} không đủ trong kho`);
          }
          // Kiểm tra liều dùng
          const dosageValue = parseFloat(medicine.dosage);
          if (isNaN(dosageValue) || dosageValue <= 0) {
            alert(`Liều dùng của thuốc ${medicine.name} phải là một số dương!`);
            throw new Error(`Liều dùng không hợp lệ cho thuốc ${medicine.maThuoc}`);
          }
          if (dosageValue >= medicine.quantity) {
            alert(`Liều dùng của thuốc ${medicine.name} phải nhỏ hơn số lượng (${medicine.quantity} ${thuoc.donvitinhThuoc})!`);
            throw new Error(`Liều dùng lớn hơn hoặc bằng số lượng cho thuốc ${medicine.maThuoc}`);
          }

          const prescriptionData = {
            maLanKham: this.selectedExamination.maLanKham,
            maThuoc: medicine.maThuoc,
            tenThuoc: medicine.name,
            soluong: medicine.quantity,
            donvi: medicine.unit,
            lieuluong: medicine.dosage,
            thoigianSD: medicine.time,
          };
          await prescriptionService.create(prescriptionData);
          console.log(`Đã lưu thuốc ${medicine.name} cho lần khám ${this.selectedExamination.maLanKham}`);
          
          // Tìm thuốc trong mảng all_drug
          thuoc.soluongThuoc = (thuoc.soluongThuoc || 0) - medicine.quantity;
          // Gọi drugService.update với object thuoc
          await drugService.update(medicine.maThuoc, thuoc);
          console.log(`Đã cập nhật số lượng thuốc ${medicine.name} trong kho`);
        }
        alert('Toa thuốc đã được lưu thành công!');

        this.wsSocket.send({
          type: 'interact_drug',
          sender: 'doctor',
          data: {},
        });

        this.previewModal.hide();
        this.resetForm();
      } catch (error) {
        console.error('Lỗi khi lưu toa thuốc:', error);
        alert('Lỗi khi lưu toa thuốc. Vui lòng thử lại.');
      }
    }
  },

  mounted() {
    this.wsSocket.connect();
    this.wsSocket.ws.onopen = () => {
      this.wsSocket.send({ type: 'init', doctorId: this.doctor.maBS });
    };

    this.wsSocket.onMessage((message) => {
      if (message.type === 'drug_update') {
          this.loadDrugs();
        } 
      });
    this.previewModal = new Modal(document.getElementById('previewModal'));
    this.loadDrugs();
    
  },

  beforeDestroy() {
    this.wsSocket.disconnect();
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
.medicine-row {
  margin-bottom: 1rem;
  align-items: center;
}
.medicine-row input,
.medicine-row select,
.medicine-row button {
  margin-bottom: 0.5rem;
}
.suggestions-list {
  position: absolute;
  z-index: 1000;
  background: #fff;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}
.suggestions-list li:hover {
  background-color: #f0f0f0;
}
</style>