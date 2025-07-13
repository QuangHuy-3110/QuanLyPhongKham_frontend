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
        <div class="row pb-3">
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
        
        </div>
    </div>
  
      <!-- Hai cột -->
      <div class="row">
        <!-- Cột 1: Danh sách lần khám (dạng card) -->
        <div class="col-md-6">
          <h4 class="fw-bold mb-3">Danh Sách Lần Khám</h4>
          <div class="row g-3">
            <div
              v-for="exam in examinations"
              :key="exam.stt_lankham"
              class="col-12"
            >
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
                  <button type="button" class="btn btn-danger m-2"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Cột 2: Toa thuốc của lần khám được chọn -->
        <div class="col-md-6">
          <h4 class="fw-bold mb-3">Toa Thuốc</h4>
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
              <button type="button" class="btn btn-danger m-2" style="float: right"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <div v-else class="text-muted">
            {{ selectedExamination ? 'Không có toa thuốc cho lần khám này.' : 'Vui lòng chọn một lần khám.' }}
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

  export default {
    emits: ['update:activeIndex'],

    props: {
        patient: {type:Object, required: true},
        record: {type:Object, required: true},
        prescriptions: {type: Array, required: true}
    },

    data() {
      return {
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

        openDetailModal(exam) {
            this.selectedExamination = exam;
        }
    },

    mounted(){
      this.get_examination()
    }
  };
  </script>
  
  <style scoped>
    .card {
        border-radius: 8px;
    }

    .card-body {
        padding: 1.5rem;
    }

    .card-title {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
    }

    /* Định vị nút đóng ở góc phải trên */
    .btn-close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        z-index: 1; /* Đảm bảo nút nằm trên các phần tử khác */
    }

  .card {
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 8px;
  }
  
  .card:hover {
    background-color: #f8f9fa;
  }
  
  .card.border-primary {
    border-width: 2px;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .card-text {
    font-size: 0.9rem;
  }
  
  .btn-outline-primary {
    font-size: 0.875rem;
  }
  
  .table {
    background-color: #fff;
    border-radius: 8px;
  }
  
  .modal-content {
    border-radius: 8px;
  }
  
  .modal-body p {
    margin-bottom: 0.5rem;
  }
  
  .modal-body strong {
    color: #333;
  }

  </style>