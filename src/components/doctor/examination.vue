<template>
  <div class="modal-header">
    <h4 class="card-title fw-bold p-4 text-center">THÔNG TIN BỆNH NHÂN</h4>
    <button type="button" class="btn-close me-3" style="width: 20px; height: 20px; font-size: 1.5rem;" data-bs-dismiss="modal" aria-label="Close" @click="close_tab"></button>
  </div>
  <hr>
  <div class="card position-relative">
    <div class="card-body">
      <div>
        <button class="btn btn-light" style="float: right" data-bs-toggle="modal" data-bs-target="#editPatientModal">
          <i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa
        </button>
      </div>
      <div class="row pb-1">
        <div class="col-md-4">
          <p class="mb-4"><strong>Mã bệnh nhân:</strong> {{ patient.maBN }}</p>
          <p class="mb-4"><strong>Số BHYT:</strong> {{ patient.soBHYT }}</p>
          <p class="mb-4"><strong>Số điện thoại:</strong> {{ patient.sdtBN }}</p>
        </div>
        <div class="col-md-4">
          <p class="mb-4"><strong>Tên Bệnh Nhân:</strong> {{ patient.hotenBN }}</p>
          <p class="mb-4"><strong>Ngày Sinh:</strong> {{ formatDate(patient.ngaysinhBN) }}</p>
          <p><strong>Email:</strong> {{ patient.emailBN }}</p>
        </div>
        <div class="col-md-4">
          <p class="mb-4"><strong>CCCD:</strong> {{ patient.cccdBN }}</p>
          <p><strong>Địa Chỉ:</strong> {{ patient.diachiBN }}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <p><strong>Chiều cao:</strong> {{ patient.chieucao }} cm</p>
        </div>
        <div class="col-md-4">
          <p><strong>Cân nặng:</strong> {{ patient.cannang }} kg</p>
        </div>
        <div class="col-md-4">
          <p><strong>Nhóm máu:</strong> {{ patient.nhommau }}</p>
        </div>
      </div>
    </div>
  </div>
  <hr>
  <div class="container">
    <div class="row">
      <div class="col-md-6 scrollable-column">
        <div class="sticky-header">
          <h3 class="text-center mx-3">Danh sách bệnh án</h3>
          <button class="btn btn-success mb-3 mt-2 w-100" type="button" @click="create_record" v-if="role === 'doctor'">
            <i class="fa-solid fa-plus"></i> Thêm hồ sơ mới
          </button>
        </div>
        <div class="card mb-3" style="width: 100%;" v-for="(record, index) in list_record" :key="index" @click="get_examination(record.maHS)">
          <div class="card-body">
            <h5 class="card-title">{{ record.maHS }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Ngày lập hồ sơ: {{ formatDateForInput(record.ngaylapHS) }}</h6>
            <p class="card-text">Chuẩn đoán: {{ getFirstExaminationDiagnosis(record.maHS) || 'Chưa có lần khám' }}</p>
            <a href="#" class="card-link" @click.prevent="delete_record(record.maHS)" v-if="role === 'doctor'">Xóa hồ sơ</a>
          </div>
        </div>
      </div>
      <div class="col-md-6 d-flex">
        <div class="vertical-divider mx-3"></div>
        <div class="scrollable-column" style="width: 100%;">
          <div class="sticky-header">
            <h3 class="text-center mx-3">Danh sách lần khám</h3>
            <h4 class="text-center mx-3">{{ record.maHS }}</h4>
            <button class="btn btn-success mb-3 mt-2 w-100" type="button" :disabled="!record.maHS" data-bs-toggle="modal" data-bs-target="#exam_form" v-if="role === 'doctor'">
              <i class="fa-solid fa-plus"></i> Thêm lần khám
            </button>
          </div>
          <div class="card mb-3" style="width: 100%;" v-for="(row, index) in list_examination || []" :key="index">
            <div class="card-body">
              <h5 class="card-title">Lần khám {{ row.stt_lankham }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Bác sĩ khám: {{ row.maBS }}</h6>
              <h6 class="card-subtitle mb-2 text-muted">Ngày khám: {{ formatDateForInput(row.ngaythangnamkham) }}</h6>
              <p class="card-text">Triệu chứng: {{ row.trieuchung }}</p>
              <h6 class="card-subtitle mb-2">Thủ tục khám:</h6>
              <p class="card-text">{{ row.thutuckham }}</p>
              <h6 class="card-subtitle mb-2">Chuẩn đoán:</h6>
              <p class="card-text">{{ row.chuandoan }}</p>
              <h6 class="card-subtitle mb-2">Liệu trình điều trị:</h6>
              <p class="card-text">{{ row.lieutrinhdieutri }}</p>
              <h6 class="card-subtitle mb-2">Ngày tái khám: {{ formatDate(row.ngaytaikham) }}</h6>
              <a href="#" class="card-link" @click.prevent="openDrugModal('see', index)">Xem toa thuốc</a>
              <a href="#" class="card-link" @click.prevent="openDrugModal('add', index)" :class="{ 'disabled': row.hasPrescription }" :disabled="row.hasPrescription" v-if="role === 'doctor'">Thêm toa thuốc</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Exam form -->
  <div class="modal fade" id="exam_form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel" v-if="role === 'doctor'">Thêm lần khám bệnh mới</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form class="row g-3" @submit.prevent="submit_examform">
            <div class="col-md-3">
              <label for="maHoSo" class="form-label">Mã hồ sơ</label>
              <input type="text" class="form-control" id="maHoSo" name="maHoSo" v-model="form.maHoSo" disabled>
            </div>
            <div class="col-md-3">
              <label for="maBacSi" class="form-label">Mã bác sĩ</label>
              <input type="text" class="form-control" id="maBacSi" name="maBacSi" v-model="form.maBacSi" disabled>
            </div>
            <div class="col-md-2">
              <label for="soThuTu" class="form-label">Số thứ tự lần khám</label>
              <input type="number" class="form-control" id="soThuTu" name="soThuTu" v-model.number="form.soThuTu" min="1" placeholder="Nhập số thứ tự">
            </div>
            <div class="col-md-3">
              <label for="ngayKham" class="form-label">Ngày khám</label>
              <input type="date" class="form-control" id="ngayKham" name="ngayKham" v-model="form.ngayKham" readonly>
            </div>
            <div class="col-md-12">
              <label for="trieuChung" class="form-label">Triệu chứng</label>
              <textarea class="form-control" id="trieuChung" name="trieuChung" v-model="form.trieuChung" rows="4" placeholder="Nhập triệu chứng..."></textarea>
            </div>
            <div class="col-md-12">
              <label for="thuTucKham" class="form-label">Thủ tục khám</label>
              <textarea class="form-control" id="thuTucKham" name="thuTucKham" v-model="form.thuTucKham" rows="4" placeholder="Nhập thủ tục khám..."></textarea>
            </div>
            <div class="col-md-12">
              <label for="chuanDoan" class="form-label">Chuẩn đoán</label>
              <textarea class="form-control" id="chuanDoan" name="chuanDoan" v-model="form.chuanDoan" rows="4" placeholder="Nhập liệu chuẩn đoán..."></textarea>
            </div>
            <div class="col-md-12">
              <label for="lieutrinh" class="form-label">Liệu trình điều trị</label>
              <textarea class="form-control" id="lieutrinh" name="lieutrinh" v-model="form.lieutrinh" rows="4" placeholder="Nhập liệu trình điều trị..."></textarea>
            </div>
            <div class="col-md-3">
              <label for="ngayTaiKham" class="form-label">Ngày tái khám</label>
              <input type="date" class="form-control" id="ngayTaiKham" name="ngayTaiKham" v-model="form.ngayTaiKham">
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary">Lưu lần khám</button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Edit Patient -->
  <div class="modal fade" id="editPatientModal" tabindex="-1" aria-labelledby="editPatientModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editPatientModalLabel">Chỉnh sửa thông tin bệnh nhân</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form class="row g-3" @submit.prevent="submit_editPatient">
            <div class="col-md-6">
              <label for="hotenBN" class="form-label">Họ và tên</label>
              <input type="text" class="form-control" id="hotenBN" name="hotenBN" v-model="editForm.hotenBN" placeholder="Nhập họ và tên" required>
            </div>
            <div class="col-md-6">
              <label for="cccdBN" class="form-label">CCCD</label>
              <input type="text" class="form-control" id="cccdBN" name="cccdBN" v-model="editForm.cccdBN" placeholder="Nhập số CCCD" required>
            </div>
            <div class="col-md-6">
              <label for="sdtBN" class="form-label">SĐT</label>
              <input type="tel" class="form-control" id="sdtBN" name="sdtBN" v-model="editForm.sdtBN" placeholder="Nhập số điện thoại" required>
            </div>
            <div class="col-md-6">
              <label for="emailBN" class="form-label">Email</label>
              <input type="email" class="form-control" id="emailBN" name="emailBN" v-model="editForm.emailBN" placeholder="Nhập email">
            </div>
            <div class="col-md-12">
              <label for="diachiBN" class="form-label">Địa chỉ</label>
              <input type="text" class="form-control" id="diachiBN" name="diachiBN" v-model="editForm.diachiBN" placeholder="Nhập địa chỉ" required>
            </div>
            <div class="col-md-3">
              <label for="ngaysinhBN" class="form-label">Ngày sinh</label>
              <input type="date" class="form-control" id="ngaysinhBN" name="ngaysinhBN" v-model="editForm.ngaysinhBN" required>
            </div>
            <div class="col-md-3">
              <label for="chieucao" class="form-label">Chiều cao (cm)</label>
              <input type="number" class="form-control" id="chieucao" name="chieucao" v-model.number="editForm.chieucao" placeholder="Nhập chiều cao" min="0" required>
            </div>
            <div class="col-md-3">
              <label for="cannang" class="form-label">Cân nặng (kg)</label>
              <input type="number" class="form-control" id="cannang" name="cannang" v-model.number="editForm.cannang" placeholder="Nhập cân nặng" min="0" required>
            </div>
            <div class="col-md-3">
              <label for="nhommau" class="form-label">Nhóm máu</label>
              <select class="form-control" id="nhommau" name="nhommau" v-model="editForm.nhommau" required>
                <option value="" disabled>Chọn nhóm máu</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="soBHYT" class="form-label">Số bảo hiểm y tế</label>
              <input type="text" class="form-control" id="soBHYT" name="soBHYT" v-model="editForm.soBHYT" placeholder="Nhập số bảo hiểm y tế">
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary">Lưu thông tin</button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal xem toa thuốc và tạo toa thuốc -->
  <div class="modal fade modal-lg" id="drug" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="drugLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="drugLabel" v-if="status === 'add'">Thêm toa thuốc</h1>
          <h1 class="modal-title fs-5" id="drugLabel" v-if="status === 'see'">Xem toa thuốc</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Add_drug v-if="status === 'add'" :selectedExamination="selectedExamination" :patient="patient" :doctor="doctor" />
          <Table_drug v-if="status === 'see'" :selectedExamination="selectedExamination" :patient="patient" :list_prescription="list_prescription" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recordService from '../../services/record.service';
import examinationSevice from '../../services/examination.sevice';
import patientService from '../../services/patient.service';
import Table_drug from '../element/table_drug.vue';
import Add_drug from './add_drug.vue';
import prescriptionService from '../../services/prescription.service';
import { Modal } from 'bootstrap';
import WebSocketService from '@/services/ws.service';

export default {
  props: {
    patient: { type: Object, required: true },
    doctor: { type: Object },
    role: { type: String, default: '' }
  },
  emits: ['close:examination', 'update:patient'],
  components: {
    Table_drug,
    Add_drug,
  },
  data() {
    return {
      wsService: new WebSocketService(),
      status: '',
      selectedExamination: null,
      list_record: [],
      list_examination: [],
      list_prescription: null,
      record: {
        maHS: '',
        date: '',
      },
      form: {
        maHoSo: '',
        maBacSi: '',
        soThuTu: null,
        ngayKham: new Date().toISOString().split('T')[0],
        trieuChung: '',
        thuTucKham: '',
        chuanDoan: '',
        lieutrinh: '',
        ngayTaiKham: '',
      },
      editForm: {
        maBN: '',
        hotenBN: '',
        cccdBN: '',
        sdtBN: '',
        emailBN: '',
        diachiBN: '',
        ngaysinhBN: '',
        chieucao: null,
        cannang: null,
        nhommau: '',
        soBHYT: '',
      },
      today: new Date(),
      drugModal: null,
      editPatientModal: null,
      firstDiagnoses: {},
    };
  },
  watch: {
    'list_record.length': {
      handler(newLength) {
        this.updateUI();
      },
      immediate: true,
    },
    'list_examination.length': {
      handler(newLength) {
        this.updateUI();
      },
      immediate: true,
    },
    'record.maHS': {
      handler(newMaHS) {
        if (newMaHS) {
          this.form.maHoSo = newMaHS;
          this.form.maBacSi = this.doctor?.maBS || '';
          this.form.ngayKham = this.record.date || new Date().toISOString().split('T')[0];
        } else {
          this.form.maHoSo = '';
          this.form.maBacSi = '';
          this.form.ngayKham = new Date().toISOString().split('T')[0];
        }
      },
      immediate: true,
    },
    patient: {
      handler(newPatient) {
        this.editForm = {
          ...newPatient,
          ngaysinhBN: this.formatDateForInput(newPatient.ngaysinhBN)
        };
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.wsService.connect();
    this.get_record();
    this.drugModal = new Modal(document.getElementById('drug'));
    this.editPatientModal = new Modal(document.getElementById('editPatientModal'));
  },

  beforeDestroy() {
    this.wsService.disconnect();
  },

  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN');
    },
    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    },
    async openDrugModal(status, index) {
      try {
        this.status = status;
        this.selectedExamination = this.list_examination[index];
        this.list_prescription = await prescriptionService.get_exam(this.selectedExamination.maLanKham);
        this.drugModal.show();
      } catch (error) {
        console.log("Lỗi khi lấy toa thuốc:", error);
      }
    },
    updateUI() {
      // console.log('Cập nhật giao diện với list_record:', this.list_record);
    },
    close_tab() {
      this.$emit('close:examination');
      this.selectedExamination = null;
    },
    async get_record() {
      try {
        this.list_record = await recordService.get_patient(this.patient.maBN);
        for (let record of this.list_record) {
          await this.fetchFirstDiagnosis(record.maHS);
        }
      } catch (error) {
        console.log('Lỗi khi lấy hồ sơ khám bệnh:', error);
      }
    },
    async fetchFirstDiagnosis(maHS) {
      try {
        const examinations = await examinationSevice.get_profile(maHS);
        if (examinations && examinations.length > 0) {
          const firstExam = examinations.sort((a, b) => a.stt_lankham - b.stt_lankham)[0];
          this.firstDiagnoses[maHS] = firstExam.chuandoan || '';
        } else {
          this.firstDiagnoses[maHS] = '';
        }
      } catch (error) {
        console.log(`Lỗi khi lấy chuẩn đoán lần đầu tiên cho hồ sơ ${maHS}:`, error);
        this.firstDiagnoses[maHS] = '';
      }
    },
    getFirstExaminationDiagnosis(maHS) {
      return this.firstDiagnoses[maHS] || 'Chưa có lần khám';
    },
    async get_examination(maHS) {
      try {
        this.record.maHS = maHS;
        this.record.date = new Date().toISOString().split('T')[0];
        this.list_examination = await examinationSevice.get_profile(maHS);
        for (let exam of this.list_examination) {
          const prescriptions = await prescriptionService.get_exam(exam.maLanKham);
          exam.hasPrescription = prescriptions && prescriptions.length > 0;
        }
        await this.fetchFirstDiagnosis(maHS);
      } catch (error) {
        console.log('Lỗi khi lấy danh sách lần khám:', error);
      }
    },
    async create_record() {
      try {
        let date = new Date().toISOString().split('T')[0];
        let exam = {
          maBN: this.patient.maBN,
          ngaylapHS: date,
        };
        await recordService.create(exam);
        alert('Thêm hồ sơ thành công!');
        this.wsService.send({
          type: 'interact_record',
          sender: 'doctor',
          data: { maBN: this.patient.maBN, date: date },
        });
        await this.get_record();
      } catch (error) {
        alert('Thêm hồ sơ không thành công!');
        console.log('Lỗi khi thêm hồ sơ bệnh án:', error);
      }
    },
    async delete_record(id) {
      try {
        await recordService.delete(id);
        alert('Xóa hồ sơ thành công!');
        await this.get_record();
        this.record.maHS = '';
        this.list_examination = [];
      } catch (error) {
        alert('Xóa hồ sơ không thành công!');
        console.log('Lỗi khi xóa hồ sơ bệnh án:', error);
      }
    },
    async submit_examform() {
      try {
        const examData = {
          maHS: this.form.maHoSo,
          maBS: this.form.maBacSi,
          stt_lankham: this.form.soThuTu,
          ngaythangnamkham: this.form.ngayKham,
          trieuchung: this.form.trieuChung,
          thutuckham: this.form.thuTucKham,
          chuandoan: this.form.chuanDoan,
          lieutrinhdieutri: this.form.lieutrinh,
          ngaytaikham: this.form.ngayTaiKham,
        };
        await examinationSevice.create(examData);
        alert('Thêm lần khám thành công!');
        await this.get_examination(this.form.maHoSo);
        this.resetForm();
        this.wsService.send({
          type: 'interact_exam',
          sender: 'doctor',
          data: { examData },
        });
        document.querySelector('#exam_form .btn-close').click();
      } catch (error) {
        alert('Thêm lần khám không thành công!');
        console.log('Lỗi khi thêm lần khám:', error);
      }
    },
    async submit_editPatient() {
      try {
        await patientService.update(this.editForm.maBN, this.editForm);
        alert('Cập nhật thông tin bệnh nhân thành công!');
        this.$emit('update:patient', this.editForm);
        this.editPatientModal.hide();
      } catch (error) {
        alert('Cập nhật thông tin bệnh nhân không thành công!');
        console.log('Lỗi khi cập nhật thông tin bệnh nhân:', error);
      }
    },
    resetForm() {
      this.form = {
        maHoSo: this.record.maHS,
        maBacSi: this.doctor?.maBS || '',
        soThuTu: null,
        ngayKham: new Date().toISOString().split('T')[0],
        trieuChung: '',
        thuTucKham: '',
        chuanDoan: '',
        lieutrinh: '',
        ngayTaiKham: '',
      };
    },
  },
};
</script>

<style scoped>
.scrollable-column {
  max-height: 700px;
  overflow-y: auto;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fff;
  padding-top: 10px;
}
.vertical-divider {
  border-left: 1px solid #dee2e6;
  height: auto;
  align-self: stretch;
}
.modal-body {
  padding: 2rem;
}
.form-label {
  font-weight: 500;
  color: #333;
}
.form-control,
.form-control:focus {
  border-radius: 6px;
  border: 1px solid #ced4da;
  box-shadow: none;
}
.form-control::placeholder {
  color: #6c757d;
  opacity: 0.7;
}
textarea.form-control {
  resize: vertical;
  min-height: 80px;
}
.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-success:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
.btn-secondary {
  background-color: #6c757d;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
}
.btn-secondary:hover {
  background-color: #5a6268;
}
.row {
  margin-bottom: 1rem;
}
.card-link.disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>