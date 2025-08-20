```vue
<template>
  <!-- Post a Comment -->
  <div class="container content-space-2">
        <!-- Card -->
        <div class="card card-lg border shadow-none">
          <div class="w-md-75 w-lg-50 text-center mx-md-auto mb-5 mb-md-9">
            <p class="mb-0 fw-bold fs-2 text-muted mt-4"
                style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
                Đặt lịch khám bệnh
            </p>
            <hr>
          </div>
  
          <p class="text-center" style="font-family: 'Poppins', sans-serif; font-size: 18px;">"<i>Hãy tạo lịch hẹn khám của bạn bằng cách hoàn thành các thao tác bên dưới</i>"</p>
          
          <div class="card-body">
            <!-- <form> -->
              <div class="d-grid gap-4">
                <!-- Form -->
                <div class="row">
  
                  <!-- Chọn chuyên khoa -->
                  <div class="container py-4">
                    <label class="form-label fw-bold">Chọn chuyên khoa để khám</label>
                    <div class="row gy-3 mt-2 mx-4">
                      <!-- chuyên khoa -->
                      <div class="col-4"
                           v-for="(special) in specialties"
                           :key="special.maCK">
                        <div class="form-check">
                          <input class="form-check-input" 
                                 type="radio" 
                                 name="radioChuyenKhoa" 
                                 :id="'radioChuyenKhoa' + special.maCK" 
                                 :value="special.maCK"
                                 v-model="selectedSpecialty"
                                 @change="fetchDoctorsBySpecialty">
                          <label class="form-check-label" :for="'radioChuyenKhoa' + special.maCK">
                              {{ special.tenCK }}
                          </label>
                        </div>
                      </div>
                      <!-- chuyên khoa -->
                    </div>
                  </div>
  
                  <!-- Chọn bác sĩ -->
                  <div class="container py-4" v-if="doctors.length > 0">
                    <label class="form-label fw-bold">Chọn bác sĩ</label>
                    <div class="row gy-3 mt-2">
                      <!-- Bác sĩ -->
                      <div class="col-4"
                           v-for="(doctor) in doctors"
                           :key="doctor.maBS">
                        <div class="card" style="width: 18rem;"
                             @click.prevent="selectDoctor(doctor)">
                          <div class="card-body">
                              <h5 class="card-title mb-3">Bác sĩ {{ doctor.tenBS }}</h5>
                              <h6 class="card-subtitle mb-3 text-body-secondary">CCHN: {{ doctor.soCCHN }}</h6>
                              <p class="card-text">Nơi cấp CCHN: {{ doctor.noicapCCHN }}</p>
                              <p class="card-text">Số điện thoại: {{ doctor.sdtBS }}</p>
                              <!-- <a href="#" 
                                 class="card-link"
                                 >Chọn bác sĩ</a> -->
                          </div>
                        </div>
                      </div>
                      <!-- Bác sĩ -->
                    </div>
                  </div>
                  <div class="container py-4" v-else>
                    <p class="text-center">Vui lòng chọn một chuyên khoa để xem danh sách bác sĩ.</p>
                  </div>

                  <!-- Thông tin bác sĩ được chọn -->
                  <div class="container py-4" v-if="selectedDoctor">
                    <label class="form-label fw-bold">Bác sĩ đã chọn</label>
                    <div class="card" style="width: 20rem;">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Bác sĩ {{ selectedDoctor.tenBS }}</h5>
                        <h6 class="card-subtitle mb-3 text-body-secondary">Mã bác sĩ: {{ selectedDoctor.maBS }}</h6>
                        <h6 class="card-subtitle mb-2 text-body-secondary">CCHN: {{ selectedDoctor.soCCHN }}</h6>
                        <p class="card-text">Nơi cấp CCHN: {{ selectedDoctor.noicapCCHN }}</p>
                        <p class="card-text">Ngày sinh: {{ formatValue(selectedDoctor.ngaysinhBS) }}</p>
                        <p class="card-text">Số điện thoại: {{ selectedDoctor.sdtBS }}</p>
                        <p class="card-text">Email: {{ selectedDoctor.emailBS }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Lịch khám của bác sĩ -->
                <span class="d-block">
                  <label class="form-label fw-bold">Lịch khám của bác sĩ</label>
                  <Calendar class="form-control form-control-lg"
                    :array="{ list: working_time }"
                    :columns="working_timeColumns"
                    @getdate="getdate"
                    v-if="selectedDoctor && working_time.length > 0"
                  />
                  <p class="text-center" v-else-if="selectedDoctor">Bác sĩ này hiện không có lịch làm việc.</p>
                </span>
                
                <!-- Chọn thời gian khám -->
                <div class="container py-4">
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
  
                <!-- Form -->
                <span class="d-block">
                  <label class="form-label fw-bold" for="blogContactsFormComment">Mô tả bệnh trạng</label>
                  <textarea class="form-control form-control-lg" id="blogContactsFormComment" name="blogContactsCommentName" placeholder="Hãy mô tả sơ lượt trạng thái bệnh của bạn ở đây...." aria-label="Leave your comment here..." rows="5" v-model="moTaBenh"></textarea>
                </span>
                <!-- End Form -->
  
                <!-- Thông báo lỗi -->
                <div class="container py-2" v-if="errorMessage">
                  <p class="text-danger text-center">{{ errorMessage }}</p>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="!isFormValid" @click.prevent="bookAppointment">Đặt lịch</button>
                </div>
              </div>
            <!-- </form> -->
          </div>
        </div>
        <!-- End Card -->
      </div>
  <!-- End Post a Comment -->
</template>

<script>
import Calendar from '../element/calendar.vue';
import WorkingTime from '@/services/working_time.service';
import specialtiesService from '../../services/specialties.service';
import doctor_roleService from '../../services/doctor_role.service';
import doctorService from '../../services/doctor.service';
import appointmentService from '../../services/appointment.service';
import WebSocketService from '../../services/ws.service';

export default {
  components: {
    Calendar,
  },

  emits: ['appointmentBooked'],

  props: {
    patient: { type: Object, required: true },
  },

  data() {
    return {
      wsService: new WebSocketService(),
      doctor_role: [],
      doctors: [],
      specialties: [],
      working_time: [],
      selectedSpecialty: null,
      selectedDoctor: null,
      working_timeColumns: [
        { key: 'ngaythangnam', header: 'Ngày' },
        { key: 'giobatdau', header: 'Giờ bắt đầu' },
        { key: 'gioketthuc', header: 'Giờ kết thúc' },
        { key: 'trangthai', header: 'Trạng thái' }
      ],
      ngayHen: null,
      gioHen: null,
      moTaBenh: null,
      errorMessage: null,
      minTime: null, // Giới hạn giờ bắt đầu
      maxTime: null, // Giới hạn giờ kết thúc
      minDate: null, // Ngày tối thiểu (hôm nay)
    };
  },

  computed: {
    // Kiểm tra xem form có hợp lệ không
    isFormValid() {
      return this.selectedSpecialty &&
             this.selectedDoctor &&
             this.ngayHen &&
             this.gioHen &&
             this.moTaBenh;
    },
    // Tạo danh sách các khung giờ từ minTime đến maxTime, cách nhau 30 phút
    availableTimes() {
      // Nếu không có minTime hoặc maxTime, trả về mảng rỗng
      if (!this.minTime || !this.maxTime) {
        return [];
      }
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
    getdate(day, min, max, trangthai) {
      // Kiểm tra ngày có trạng thái "Nghỉ" hay không
      if (trangthai === 'Nghỉ') {
        this.errorMessage = 'Buổi này bác sĩ không làm việc. Vui lòng chọn ngày khác.';
        this.ngayHen = null;
        this.gioHen = null;
        this.minTime = null;
        this.maxTime = null;
        return;
      }
      // Kiểm tra ngày trong quá khứ
      const selectedDate = new Date(day);
      const today = new Date(this.minDate);
      today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00 để so sánh chính xác
      if (selectedDate < today) {
        this.errorMessage = 'Không thể chọn ngày trong quá khứ. Vui lòng chọn ngày từ hôm nay trở đi.';
        this.ngayHen = null;
        this.gioHen = null;
        this.minTime = null;
        this.maxTime = null;
        return;
      }
      this.ngayHen = day; // Lưu ngày được chọn
      this.minTime = min; // Lưu giờ bắt đầu
      this.maxTime = max; // Lưu giờ kết thúc
      this.gioHen = null; // Đặt lại giờ khi chọn ngày mới
      this.errorMessage = null; // Xóa thông báo lỗi nếu ngày hợp lệ
    },

    async get_specialties() {
      try {
        this.specialties = await specialtiesService.getAll();
      } catch (error) {
        console.error('Lỗi khi lấy các chuyên khoa!', error);
      }
    },

    async fetchDoctorsBySpecialty() {
      try {
        this.doctors = []; // Xóa danh sách bác sĩ hiện tại
        if (this.selectedSpecialty) {
          // Lấy danh sách bác sĩ thuộc chuyên khoa được chọn
          const doctorRoles = await doctor_roleService.get_specialties(this.selectedSpecialty);
          // Lấy thông tin chi tiết của từng bác sĩ
          const doctorPromises = doctorRoles.map(async (role) => {
            return await doctorService.get(role.maBS);
          });
          console.log(doctorPromises);
          this.doctors = await Promise.all(doctorPromises);
          this.selectedDoctor = null; // Xóa bác sĩ đã chọn khi thay đổi chuyên khoa
          this.working_time = []; // Xóa lịch làm việc khi thay đổi chuyên khoa
          this.ngayHen = null; // Đặt lại ngày hẹn
          this.gioHen = null; // Đặt lại giờ hẹn
          this.minTime = null; // Đặt lại giờ bắt đầu
          this.maxTime = null; // Đặt lại giờ kết thúc
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bác sĩ!', error);
      }
    },

    async selectDoctor(doctor) {
      this.selectedDoctor = doctor; // Lưu bác sĩ được chọn
      this.ngayHen = null; // Đặt lại ngày hẹn
      this.gioHen = null; // Đặt lại giờ hẹn
      this.minTime = null; // Đặt lại giờ bắt đầu
      this.maxTime = null; // Đặt lại giờ kết thúc
      try {
        this.working_time = await WorkingTime.get_doctor(doctor.maBS); // Lấy lịch làm việc của bác sĩ
      } catch (error) {
        console.error('Lỗi khi lấy lịch làm việc của bác sĩ!', error);
        this.working_time = []; // Đặt lại lịch làm việc nếu có lỗi
      }
    },

    async bookAppointment() {
      // Kiểm tra trạng thái ngày hẹn
      const selectedWorkTime = this.working_time.find(item => item.ngaythangnam === this.ngayHen);
      if (selectedWorkTime && selectedWorkTime.trangthai === 'Nghỉ') {
        this.errorMessage = 'Buổi này bác sĩ không làm việc. Vui lòng chọn ngày khác.';
        return;
      }

      // Kiểm tra lại điều kiện hợp lệ
      if (!this.isFormValid) {
        this.errorMessage = 'Vui lòng điền đầy đủ thông tin: chuyên khoa, bác sĩ, ngày, giờ và mô tả bệnh trạng.';
        return;
      }

      // Kiểm tra ngày trong quá khứ
      const selectedDate = new Date(this.ngayHen);
      const today = new Date(this.minDate);
      today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00 để so sánh chính xác
      if (selectedDate < today) {
        this.errorMessage = 'Không thể chọn ngày trong quá khứ. Vui lòng chọn ngày từ hôm nay trở đi.';
        return;
      }

      this.errorMessage = null; // Xóa thông báo lỗi nếu hợp lệ

      // Tạo object tổng hợp thông tin
      const appointmentData = {
        ngaythangnam: this.ngayHen,
        mota: this.moTaBenh,
        khunggio: this.gioHen,
        trangthai: "ChuaKham",
        maBS: this.selectedDoctor.maBS,
        maBN: this.patient.maBN,
        maCK: this.selectedSpecialty,
      };

      try {
        await appointmentService.create(appointmentData);
        // Gửi lịch hẹn qua WebSocket
        this.wsService.send({
          type: 'new_appointment',
          data: appointmentData,
        });
        this.$emit('appointmentBooked', appointmentData); // Phát sự kiện để thông báo đặt lịch thành công
        this.message = 'Lịch hẹn đã được gửi!';        
        alert("Đặt lịch thành công!");
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Thêm lịch hẹn thất bại!';
        alert(errorMessage);
      }
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

    // Hàm tính ngày hiện tại để làm giá trị min cho input date
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },

  mounted() {
    this.minDate = this.getTodayDate(); // Thiết lập ngày tối thiểu khi component được mount
    this.get_specialties();
    this.wsService.connect(); // Kết nối WebSocket
    // Xử lý tin nhắn từ server (ví dụ: xác nhận từ server)
    this.wsService.onMessage((message) => {
      if (message.type === 'response') {
        this.message = message.data;
      }
    });
  },

  beforeDestroy() {
    this.wsService.disconnect(); // Đóng WebSocket khi component bị hủy
  },
};
</script>

<style scoped>
.card:hover {
  transform: translateY(-5px); /* Nâng card lên 5px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Thêm bóng */
  border-color: #007bff; /* Đổi màu viền khi hover */
  transition: all 0.3s ease; /* Hiệu ứng mượt */
}
</style>
```