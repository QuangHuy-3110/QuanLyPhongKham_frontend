<template>
  <div class="container content-space-2">
    <div class="card card-lg border shadow-none">
      <div class="w-md-75 w-lg-50 text-center mx-md-auto mb-5 mb-md-9">
        <p class="mb-0 fw-bold fs-2 text-muted mt-4"
           style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
          Quản lý Đặt lịch khám bệnh
        </p>
        <hr>
      </div>

      <p class="text-center" style="font-family: 'Poppins', sans-serif; font-size: 18px;">
        "<i>Tạo lịch hẹn cho bệnh nhân bằng cách hoàn thành các thao tác bên dưới</i>"
      </p>
      
      <div class="card-body">
        <div class="d-grid gap-4">

          <div class="container py-4 border rounded">
            <label class="form-label fw-bold">1. Tìm kiếm Bệnh nhân</label>
            <div class="row g-3">
              <div class="col-md-8">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Nhập tên, SĐT, hoặc Mã bệnh nhân..." 
                  v-model="patientSearchQuery"
                  @input="handlePatientSearch"
                >
              </div>
            </div>

            <div class="list-group mt-3" v-if="filteredPatients.length > 0">
              <button 
                type="button" 
                class="list-group-item list-group-item-action"
                v-for="patient in filteredPatients" 
                :key="patient.maBN"
                @click="selectPatient(patient)"
              >
                <strong>{{ patient.tenBN }}</strong> ({{ patient.maBN }}) - SĐT: {{ patient.sdtBN }}
              </button>
            </div>

            <div class="container py-4" v-if="selectedPatient">
              <label class="form-label fw-bold">Bệnh nhân đã chọn</label>
              <div class="card" style="width: 20rem;">
                <div class="card-body">
                  <h5 class="card-title mb-3">{{ selectedPatient.tenBN }}</h5>
                  <h6 class="card-subtitle mb-3 text-body-secondary">Mã Bệnh nhân: {{ selectedPatient.maBN }}</h6>
                  <p class="card-text">SĐT: {{ selectedPatient.sdtBN }}</p>
                  <button class="btn btn-sm btn-outline-danger mt-2" @click="resetPatientSelection">
                    Bỏ chọn
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedPatient">
            <div class="row">
              <div class="container py-4">
                <label class="form-label fw-bold">2. Chọn chuyên khoa</label>
                <div class="row gy-3 mt-2 mx-4">
                  <div class="col-4"
                       v-for="(special) in allSpecialties" 
                       :key="special.maCK">
                    <div class="form-check">
                      <input class="form-check-input" 
                             type="radio" 
                             name="radioChuyenKhoa" 
                             :id="'radioChuyenKhoa' + special.maCK" 
                             :value="special.maCK"
                             v-model="selectedSpecialty"
                             @change="handleSpecialtyChange">
                      <label class="form-check-label" :for="'radioChuyenKhoa' + special.maCK">
                        {{ special.tenCK }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="container py-4" v-if="filteredDoctors.length > 0">
                <label class="form-label fw-bold">3. Chọn bác sĩ</label>
                <div class="row gy-3 mt-2">
                  <div class="col-4"
                       v-for="(doctor) in filteredDoctors"
                       :key="doctor.maBS">
                    <div class="card" @click.prevent="selectDoctor(doctor)">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Bác sĩ {{ doctor.tenBS }}</h5>
                        <h6 class="card-subtitle mb-3 text-body-secondary">CCHN: {{ doctor.soCCHN }}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="container py-4" v-else-if="selectedSpecialty">
                <p class="text-center">Chuyên khoa này chưa có bác sĩ.</p>
              </div>

              <div class="container py-4" v-if="selectedDoctor">
                <label class="form-label fw-bold">Bác sĩ đã chọn</label>
                <div class="card" style="width: 20rem;">
                  <div class="card-body">
                    <h5 class="card-title mb-3">Bác sĩ {{ selectedDoctor.tenBS }}</h5>
                    <h6 class="card-subtitle mb-3 text-body-secondary">Mã bác sĩ: {{ selectedDoctor.maBS }}</h6>
                    <h6 class="card-subtitle mb-2 text-body-secondary">CCHN: {{ selectedDoctor.soCCHN }}</h6>
                  </div>
                </div>
              </div>
            </div>
            
            <span class="d-block" v-if="selectedDoctor">
              <label class="form-label fw-bold">4. Lịch khám của bác sĩ</label>
              <Calendar class="form-control form-control-lg"
                :array="{ list: filteredWorkingTime }"
                :columns="working_timeColumns"
                @getdate="getdate"
                v-if="filteredWorkingTime.length > 0"
              />
              <p class="text-center" v-else>Bác sĩ này hiện không có lịch làm việc.</p>
            </span>
            
            <div class="container py-4" v-if="selectedDoctor">
              <label class="form-label fw-bold">5. Chọn thời gian khám</label>
              <div class="row g-3">
                <div class="col-4">
                  <label for="ngayHen" class="form-label">Chọn ngày</label>
                  <input type="date" class="form-control" id="ngayHen" name="ngayHen" :min="minDate" disabled required v-model="ngayHen">
                </div>
                <div class="col-4">
                  <label for="gioHen" class="form-label">Chọn giờ</label>
                  <select class="form-control" id="gioHen" name="gioHen" required v-model="gioHen" :disabled="!availableTimes.length">
                    <option value="" disabled>Chọn khung giờ</option>
                    <option v-for="(time, index) in availableTimes" :key="index" :value="time">{{ time }}</option>
                  </select>
                </div>
              </div>
            </div>
  
            <span class="d-block" v-if="selectedDoctor">
              <label class="form-label fw-bold" for="blogContactsFormComment">6. Mô tả bệnh trạng</label>
              <textarea class="form-control form-control-lg" id="blogContactsFormComment" name="blogContactsCommentName" placeholder="Hãy mô tả sơ lượt trạng thái bệnh của bạn ở đây...." aria-label="Leave your comment here..." rows="5" v-model="moTaBenh"></textarea>
            </span>
            
            <div class="container py-2" v-if="errorMessage">
              <p class="text-danger text-center">{{ errorMessage }}</p>
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="!isFormValid || isLoading" @click.prevent="submitAppointment">
                {{ isLoading ? 'Đang xử lý...' : 'Đặt lịch' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
import Calendar from '../element/calendar.vue';
import appointmentService from '../../services/appointment.service';

export default {
  components: {
    Calendar,
  },

  props: {
    // NHẬN TẤT CẢ DATA TỪ CHA
    allSpecialties: { type: Array, required: true },
    allPatients: { type: Array, required: true },
    allDoctors: { type: Array, required: true },
    allDoctorRoles: { type: Array, required: true }, // Bảng liên kết (maBS, maCK)
    allWorkingTimes: { type: Array, required: true }, // Toàn bộ lịch làm việc
    
    // Prop cho trạng thái submit
    isLoading: { type: Boolean, default: false },
    errorMessage: { type: String, default: null },
  },
  
  emits: [
    'book-appointment' // Chỉ emit khi bấm nút đặt lịch cuối cùng
  ],

  data() {
    return {
      // Dữ liệu trạng thái nội bộ
      patientSearchQuery: '',
      selectedPatient: null, 
      selectedSpecialty: null,
      selectedDoctor: null,
      
      ngayHen: null,
      gioHen: null,
      moTaBenh: null,
      minTime: null, 
      maxTime: null, 
      minDate: null, 
      
      working_timeColumns: [
        { key: 'ngaythangnam', header: 'Ngày' },
        { key: 'giobatdau', header: 'Giờ bắt đầu' },
        { key: 'gioketthuc', header: 'Giờ kết thúc' },
        { key: 'trangthai', header: 'Trạng thái' }
      ],
    };
  },

  computed: {
    // 1. Tự lọc bệnh nhân
    filteredPatients() {
      if (this.patientSearchQuery.length < 2) {
        return [];
      }
      const query = this.patientSearchQuery.toLowerCase();
      // Lọc từ prop 'allPatients'
     return this.allPatients.filter(patient => {
        // Thêm (|| '') để phòng trường hợp data là null hoặc undefined
        const tenBNMatch = (patient.tenBN || '').toLowerCase().includes(query);
        const sdtBNMatch = (patient.sdtBN || '').includes(query);
        const maBNMatch = (patient.maBN || '').toLowerCase().includes(query);

        return tenBNMatch || sdtBNMatch || maBNMatch;
      });
    },

    // 2. Tự lọc bác sĩ
    filteredDoctors() {
      if (!this.selectedSpecialty) {
        return [];
      }
      // Lấy ra danh sách các role thuộc chuyên khoa đã chọn
      const rolesInSpecialty = this.allDoctorRoles.filter(
        role => role.maCK === this.selectedSpecialty
      );
      
      // Lấy ra mã bác sĩ từ các role đó
      const doctorIds = rolesInSpecialty.map(role => role.maBS);
      
      // Lọc danh sách 'allDoctors'
      return this.allDoctors.filter(
        doctor => doctorIds.includes(doctor.maBS)
      );
    },

    // 3. Tự lọc lịch làm việc
    filteredWorkingTime() {
      if (!this.selectedDoctor) {
        return [];
      }
      // Lọc từ prop 'allWorkingTimes'
      return this.allWorkingTimes.filter(
        work => work.maBS === this.selectedDoctor.maBS
      );
    },

    // (availableTimes và isFormValid giữ nguyên)
    isFormValid() {
      return this.selectedPatient &&
             this.selectedSpecialty &&
             this.selectedDoctor &&
             this.ngayHen &&
             this.gioHen &&
             this.moTaBenh;
    },
    availableTimes() {
      if (!this.minTime || !this.maxTime) return [];
      const times = [];
      const [minHours, minMinutes] = this.minTime.split(':').map(Number);
      const [maxHours, maxMinutes] = this.maxTime.split(':').map(Number);
      let currentHours = minHours;
      let currentMinutes = minMinutes;
      while (currentHours < maxHours || (currentHours === maxHours && currentMinutes <= maxMinutes)) {
        const timeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
        times.push(timeStr);
        currentMinutes += 30;
        if (currentMinutes >= 60) {
          currentMinutes -= 60;
          currentHours += 1;
        }
      }
      return times;
    }
  },

  methods: {
    // HÀM TÌM KIẾM: KHÔNG CẦN EMIT NỮA
    handlePatientSearch() {
      // Không làm gì cả, computed 'filteredPatients' sẽ tự chạy
    },
    
    // HÀM CHỌN CHUYÊN KHOA: KHÔNG CẦN EMIT NỮA
    handleSpecialtyChange() {
      // Chỉ cần set data, computed 'filteredDoctors' sẽ tự chạy
      // Reset các bước sau
      this.selectedDoctor = null;
      this.ngayHen = null;
      this.gioHen = null;
      this.minTime = null;
      this.maxTime = null;
    },

    // HÀM CHỌN BÁC SĨ: KHÔNG CẦN EMIT NỮA
    selectDoctor(doctor) {
      // Chỉ cần set data, computed 'filteredWorkingTime' sẽ tự chạy
      this.selectedDoctor = doctor; 
      // Reset các bước sau
      this.ngayHen = null; 
      this.gioHen = null; 
      this.minTime = null; 
      this.maxTime = null; 
    },
    
    // HÀM ĐẶT LỊCH: VẪN CẦN EMIT
    submitAppointment() {
      // ... (Toàn bộ logic kiểm tra validation giữ nguyên) ...
      if (!this.isFormValid) {
           // Bạn có thể emit lỗi hoặc xử lý tại chỗ
           return;
      }

      // Tạo object
      const appointmentData = {
        ngaythangnam: this.ngayHen,
        mota: this.moTaBenh,
        khunggio: this.gioHen,
        trangthai: "ChuaKham",
        maBS: this.selectedDoctor.maBS,
        maBN: this.selectedPatient.maBN,
        maCK: this.selectedSpecialty,
      };

      // GỬI LÊN CHO CHA
      this.$emit('book-appointment', appointmentData);
    },
    
    // Các hàm reset và tiện ích khác giữ nguyên
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.patientSearchQuery = `${patient.tenBN} (${patient.maBN})`; 
    },
    
    resetPatientSelection() {
        this.selectedPatient = null;
        this.patientSearchQuery = '';
        this.resetAppointmentForm(); 
    },
    
    resetAppointmentForm() {
        this.selectedSpecialty = null;
        this.selectedDoctor = null;
        this.ngayHen = null;
        this.gioHen = null;
        this.minTime = null;
        this.maxTime = null;
        this.moTaBenh = null;
    },
    
    getdate(day, min, max, trangthai) {
      const selectedDate = new Date(day);
      const today = new Date(this.minDate);
      today.setHours(0, 0, 0, 0);
      if (trangthai === 'Nghỉ' || selectedDate < today) {
        this.ngayHen = null;
        this.gioHen = null;
        this.minTime = null;
        this.maxTime = null;
        return;
      }
      this.ngayHen = day; 
      this.minTime = min; 
      this.maxTime = max; 
      this.gioHen = null; 
    },
    
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },

  mounted() {
    this.minDate = this.getTodayDate(); 
  },
};
</script>
