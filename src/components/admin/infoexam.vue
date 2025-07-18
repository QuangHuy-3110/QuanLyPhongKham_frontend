<template>
    <div class="container mt-4">
      <h3 class="mb-4 text-center fw-bold">Mã Hồ Sơ: {{ record.maHS }}</h3>
      <hr>
  
      <!-- Thông tin bệnh nhân -->
    <div class="card mb-4 position-relative">
        <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="close_tab">
        </button>
        <div class="card-body">
        <h4 class="card-title fw-bold pb-3">THÔNG TIN BỆNH NHÂN</h4>
        <div class="row pb-2">
            <div class="col-md-6">
                <p><strong>Mã bệnh nhân:</strong> {{ patient.maBN }}</p>
                <p><strong>CCCD:</strong> {{ patient.cccdBN }}</p>
                <p><strong>Số BHYT:</strong> {{ patient.soBHYT }}</p>
                <p><strong>Số điện thoại:</strong> {{ patient.sdtBN }}</p>
            </div>

            <div class="col-md-6">
                <p><strong>Tên Bệnh Nhân:</strong> {{ patient.hotenBN }}</p>
                <p><strong>Ngày Sinh:</strong> {{ patient.ngaysinhBN }}</p>
                <p><strong>Địa Chỉ:</strong> {{ patient.diachiBN }}</p>
                <p><strong>Email:</strong> {{ patient.emailBN }}</p>
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
        <div style="float: right;">
            <button type="button" class="btn btn-danger" title="Xóa"
              v-if="name === 'Danh sách hồ sơ bệnh án'"
              @click="deleteRecord(record)">
            >
              <i class="fa-solid fa-trash"></i>
            </button>

            <button type="button" class="btn btn-success m-2"
              v-if="name === 'Danh sách hồ sơ bệnh án đã xóa'"
              @click="restore(record)"
            >
                <i class="fa-solid fa-reply"></i>
                Khôi phục
              </button>
        </div>
        </div>
    </div>
  
      <!-- Hai cột -->
      <div class="row">
        <!-- Cột 1: Danh sách lần khám -->
        <div class="col-md-6 d-flex flex-column" style="max-height: 500px;">
          <h4 class="fw-bold mb-3 flex-shrink-0">Danh Sách Lần Khám</h4>
          <div class="overflow-auto scrollable-column" style="flex-grow: 1;">
            <div class="row g-3">
              <div v-for="exam in examinations" :key="exam.stt_lankham" class="col-12">
                <div
                  class="card h-100"
                  :class="{ 'border-primary shadow': selectedExamination && selectedExamination.stt_lankham === exam.stt_lankham }"
                  @click="selectExamination(exam)"
                >
                  <div class="card-body">
                    <h5 class="card-title">Lần khám {{ exam.stt_lankham }}</h5>
                    <p class="card-text mb-1"><strong>Ngày khám:</strong> {{ exam.ngaythangnamkham }}</p>
                    <p class="card-text mb-2"><strong>Chẩn đoán:</strong> {{ exam.chuandoan }}</p>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openDetailModal(exam)"
                      data-bs-toggle="modal"
                      data-bs-target="#examDetailModal"
                    >
                      Xem chi tiết
                    </button>
                    <button type="button" class="btn btn-danger m-2" @click="deleteExam(exam)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột 2: Toa thuốc -->
        <div class="col-md-6 d-flex flex-column" style="max-height: 500px;">
          <h4 class="fw-bold mb-3 flex-shrink-0">Toa Thuốc</h4>
          <div class="overflow-auto" style="flex-grow: 1;">
            <div v-if="selectedExamination && filteredPrescriptions.length">
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Mã Thuốc</th>
                      <th>Liều Lượng</th>
                      <th>Số Lượng</th>
                      <th>Đơn Vị</th>
                      <th>Thời Gian Sử Dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="prescription in filteredPrescriptions" :key="prescription.maThuoc">
                      <td>{{ prescription.maThuoc }}</td>
                      <td>{{ prescription.lieuluong }}</td>
                      <td>{{ prescription.soluong }}</td>
                      <td>{{ prescription.donvi }}</td>
                      <td>{{ prescription.thoigianSD }}</td>
                    </tr>
                  </tbody>
                </table>
                <button type="button" class="btn btn-danger m-2 float-end" @click="deletePre(selectedExamination)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            <div v-else class="text-muted">
              {{ selectedExamination ? 'Không có toa thuốc cho lần khám này.' : 'Vui lòng chọn một lần khám.' }}
            </div>
          </div>
        </div>
      </div>

  
      <!-- Modal chi tiết lần khám -->
      <div class="modal fade" id="examDetailModal" tabindex="-1" aria-labelledby="examDetailModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold" id="examDetailModalLabel">Chi Tiết Lần Khám</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="selectedExamination">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>STT Lần Khám:</strong> {{ selectedExamination.stt_lankham }}</p>
                  <p><strong>Mã Hồ Sơ:</strong> {{ selectedExamination.maHS }}</p>
                  <p><strong>Mã Bác Sĩ:</strong> {{ selectedExamination.maBS }}</p>
                  <p><strong>Ngày Khám:</strong> {{ selectedExamination.ngaythangnamkham }}</p>
                  <p><strong>Ngày Tái Khám:</strong> {{ selectedExamination.ngaytaikham }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Triệu Chứng:</strong> {{ selectedExamination.trieuchung }}</p>
                  <p><strong>Thủ Tục Khám:</strong> {{ selectedExamination.thutuckham }}</p>
                  <p><strong>Chẩn Đoán:</strong> {{ selectedExamination.chuandoan }}</p>
                  <p><strong>Liệu Trình Điều Trị:</strong> {{ selectedExamination.lieutrinhdieutri }}</p>
                </div>
              </div>
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

  import examinationService from '../../services/examination.sevice'
  import recordService from '../../services/record.service';
  import prescriptionService from '../../services/prescription.service';
  import WebSocketService from '../../services/ws.service';

  export default {
    emits: ['update:activeIndex'],

    props: {
        name: {type: String, required: true},
        patient: {type:Object, required: true},
        record: {type:Object, required: true},
        prescriptions: {type: Array, required: true}
    },
   
    data() {
      return {
        wsService: new WebSocketService(),
        examinations: [],
        selectedExamination: null
      };
    },
    computed: {
      filteredPrescriptions() {
        if (!this.selectedExamination) return [];
        return this.prescriptions.filter(p => p.maLanKham === this.selectedExamination.maLanKham);
      }
    },
    methods: {
        close_tab(){
            this.$emit('update:activeIndex', -1);
        },

        async get_examination (){
          try {
            this.examinations = await examinationService.get_profile(this.record.maHS)
          }catch (error){
            console.log("Lỗi khi lấy lần khám!")
          }
        },

        async selectExamination(exam) {
            this.selectedExamination = exam;
        },

        async restore(record) {
            try {
              record = this.formatEditRow(record);
              record.xoa = 0; // Đặt trường xóa về 0
              await recordService.update(record.maHS, record);
              this.$emit('update:array'); // Cập nhật danh sách hồ sơ
              alert("Khôi phục thành công hồ sơ!");
              this.close_tab(); // Đóng tab hiện tại
            } catch (error) {
                console.error("Lỗi khi khôi phục hồ sơ:", error);
            }
        },

        async deletePre(exam) {
            try {
              let prescriptions = this.prescriptions.filter(p => p.maLanKham === exam.maLanKham);
              for (let prescription of prescriptions) {
                await prescriptionService.delete(prescription.maLanKham, prescription.maThuoc);
              }
            
              this.$emit('update:prescriptions'); // Cập nhật danh sách hồ sơ
              alert("Xóa thành công toa thuốc!");
              this.selectedExamination = null; // Reset selected examination
            } catch (error) {
                console.error("Lỗi khi xóa hồ sơ:", error);
            }
        },

        async deleteExam(exam) {
            try{
              let prescriptions = this.prescriptions.filter(p => p.maLanKham === exam.maLanKham);
              for (let prescription of prescriptions) {
                await prescriptionService.delete(prescription.maLanKham, prescription.maThuoc);
              }
              await examinationService.delete(exam.maLanKham);
              alert("Xóa thành công lần khám!");
              this.examinations = this.examinations.filter(e => e.maLanKham !== exam.maLanKham);
            }catch (error) {
              console.error("Lỗi khi xóa lần khám:", error);
              alert("Lỗi khi xóa lần khám!");
            }
        },

        isDateField(key, value) {
          return typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value);
        },

        formatEditRow(row) {
          const formattedRow = { ...row };
          Object.keys(formattedRow).forEach((key) => {
            if (this.isDateField(key, formattedRow[key])) {
              const date = new Date(formattedRow[key]);
              if (!isNaN(date)) {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                formattedRow[key] = `${year}-${month}-${day}`;
              }
            }
          });
          return formattedRow;
        },

        async deleteRecord(hoso) {
            try {
              hoso = this.formatEditRow(hoso);
              hoso.xoa = 1
              await recordService.update(hoso.maHS, hoso);
              // // this.examinations.splice(index, 1);
              this.selectedExamination = null; // Reset selected examination
              this.$emit('update:array'); // Close the tab
              console.log("Xóa thành công hồ sơ:", hoso.maHS);
              alert("Xóa thành công hồ sơ!");
              this.close_tab();
            } catch (error) {
                console.error("Lỗi khi xóa lần khám:", error);
            }
        },

        openDetailModal(exam) {
            this.selectedExamination = exam;
        }
    },

    mounted(){
      this.get_examination()
      this.wsService.connect()
      this.wsService.ws.onopen = () => {
        this.wsService.send({ type: 'init', doctorId: 'Admin' });
      };
      this.wsService.onMessage((message) => {
        if (message.type === 'exam_created') {
          this.get_examination();
        }
      });
    },

    beforeDestroy() {
      this.wsService.disconnect();
    }
  };
  </script>
  
  <style scoped>
    @import "@/assets/infoexam.css";
  </style>