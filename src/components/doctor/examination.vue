<template>
  <div class="modal-header">
    <h5 class="modal-title">Thông tin bệnh nhân</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close_tab"></button>
  </div>
  <hr>
  <div class="container">
    <div class="d-flex align-items-center gap-4">
      <div>
        <img class="img-account-profile rounded-circle img-fluid" style="width: 100px; height: 100px; object-fit: cover;" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="Avatar">
      </div>
      <div>
        <p class="d-flex gap-5 my-3">
          <span><b>Họ và tên:</b> {{ patient.hotenBN }}</span>
          <span><b>CCCD:</b> {{ patient.cccdBN }}</span>
          <span><b>SĐT:</b> {{ patient.sdtBN }}</span>
        </p>
        <p class="d-flex gap-5 my-3">
          <span><b>Địa chỉ:</b> {{ patient.diachiBN }}</span>
          <span><b>Email:</b> {{ patient.emailBN }}</span>
        </p>
        <p class="d-flex gap-5 my-3">
          <span><b>Ngày sinh:</b> {{ patient.ngaysinhBN }}</span>
          <span><b>Chiều cao:</b> {{ patient.chieucao }}</span>
          <span><b>Cân nặng:</b> {{ patient.cannang }}</span>
          <span><b>Nhóm máu:</b> {{ patient.nhommau }}</span>
        </p>
      </div>
    </div>
  </div>
  <hr>
  <div class="container">
    <div class="row">
      <div class="col-md-6 scrollable-column">
        <h3 class="text-center mx-3">Danh sách bệnh án</h3>
        <button class="btn btn-success mb-3" type="button" @click="create_record" v-if="role === 'doctor'">
          <i class="fa-solid fa-plus"></i> Thêm hồ sơ mới
        </button>
        <div class="card mb-3" style="width: 100%;" v-for="(record, index) in list_record" :key="index" @click="get_examination(record.maHS)">
          <div class="card-body">
            <h5 class="card-title">{{ record.maHS }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Ngày lập hồ sơ: {{ record.ngaylapHS }}</h6>
            <p class="card-text">Chuẩn đoán: {{ getFirstExaminationDiagnosis(record.maHS) || 'Chưa có lần khám' }}</p>
            <a href="#" class="card-link" @click.prevent="delete_record(record.maHS)" v-if="role === 'doctor'">Xóa hồ sơ</a>
          </div>
        </div>
      </div>
      <div class="col-md-6 d-flex">
        <div class="vertical-divider mx-3"></div>
        <div class="scrollable-column" style="width: 100%;">
          <h3 class="text-center mx-3">Danh sách lần khám</h3>
          <button class="btn btn-success mb-3" type="button" :disabled="!record.maHS" data-bs-toggle="modal" data-bs-target="#exam_form" v-if="role === 'doctor'">
            <i class="fa-solid fa-plus"></i> Thêm lần khám
          </button>
          <div class="card mb-3" style="width: 100%;" v-for="(row, index) in list_examination || []" :key="index">
            <div class="card-body">
              <h5 class="card-title">Lần khám {{ row.stt_lankham }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Bác sĩ khám: {{ row.maBS }}</h6>
              <h6 class="card-subtitle mb-2 text-muted">Ngày khám: {{ row.ngaythangnamkham }}</h6>
              <p class="card-text">Triệu chứng: {{ row.trieuchung }}</p>
              <h6 class="card-subtitle mb-2">Thủ tục khám:</h6>
              <p class="card-text">{{ row.thutuckham }}</p>
              <h6 class="card-subtitle mb-2">Chuẩn đoán:</h6>
              <p class="card-text">{{ row.chuandoan }}</p>
              <h6 class="card-subtitle mb-2">Liệu trình điều trị:</h6>
              <p class="card-text">{{ row.lieutrinhdieutri }}</p>
              <h6 class="card-subtitle mb-2">Ngày tái khám: {{ row.ngaytaikham }}</h6>
              <a href="#" class="card-link" @click.prevent="openDrugModal('see', index)">Xem toa thuốc</a>
              <a href="#" class="card-link" @click.prevent="openDrugModal('add', index)" :class="{ 'disabled': row.hasPrescription }" 
              :disabled="row.hasPrescription" v-if="role === 'doctor'">Thêm toa thuốc</a>
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
          <Add_drug v-if="status === 'add'" 
            :selectedExamination="selectedExamination"
            :patient="patient"
          />
          <Table_drug v-if="status === 'see'" 
            :selectedExamination="selectedExamination"
            :patient="patient"
            :list_prescription="list_prescription"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recordService from '../../services/record.service';
import examinationSevice from '../../services/examination.sevice';
import Table_drug from '../element/table_drug.vue';
import Add_drug from './add_drug.vue';
import prescriptionService from '../../services/prescription.service';
import { Modal } from 'bootstrap';

export default {
  props: {
    patient: { type: Object, required: true },
    doctor: { type: Object},
    role: { type: String, default: '' }
  },
  emits: ['close:examination'],
  components: {
    Table_drug,
    Add_drug,
  },
  data() {
    return {
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
      today: new Date(),
      drugModal: null,
      firstDiagnoses: {}, // Object để lưu trữ chuẩn đoán lần đầu tiên theo maHS
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
          this.form.maBacSi = this.doctor.maBS;
          this.form.ngayKham = this.record.date;
        } else {
          this.form.maHoSo = '';
          this.form.maBacSi = '';
          this.form.ngayKham = new Date().toISOString().split('T')[0];
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.get_record();
    this.drugModal = new Modal(document.getElementById('drug'));
  },
  methods: {
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
        document.querySelector('#exam_form .btn-close').click();
      } catch (error) {
        alert('Thêm lần khám không thành công!');
        console.log('Lỗi khi thêm lần khám:', error);
      }
    },
    resetForm() {
      this.form = {
        maHoSo: this.record.maHS,
        maBacSi: this.doctor.maBS,
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
.row {
  margin-bottom: 1rem;
}
.card-link.disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>