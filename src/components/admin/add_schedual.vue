<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">Thêm Lịch Làm Việc Cho Bác Sĩ</h3>
    <hr>
    <form id="scheduleForm" class="needs-validation mt-5" novalidate @submit.prevent="handleSubmit">
      
      <div class="row g-3 mb-4 justify-content-center">
        <div class="col-md-4">
          <label class="form-label fw-bold">Kiểu lập lịch <span class="text-danger">*</span></label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="scheduleType" id="typeWeek" value="week" v-model="scheduleType">
              <label class="form-check-label" for="typeWeek">
                Lập theo Tuần
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="scheduleType" id="typeMonth" value="month" v-model="scheduleType">
              <label class="form-check-label" for="typeMonth">
                Lập theo Tháng
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <label for="doctorId" class="form-label fw-bold">Mã Bác Sĩ <span class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control"
            id="doctorId"
            name="doctorId"
            v-model="form.doctorId"
            required
            pattern="[A-Za-z0-9]{6,20}"
            placeholder="Nhập mã bác sĩ (6-20 ký tự)"
            @input="filterDoctors"
            list="doctorSuggestions"
          />
          <datalist id="doctorSuggestions">
            <option v-for="doctor in filteredDoctors" :key="doctor.maBS" :value="doctor.maBS">{{ doctor.tenBS }}</option>
          </datalist>
          <div class="invalid-feedback">Vui lòng nhập mã bác sĩ hợp lệ (6-20 ký tự chữ và số).</div>
        </div>
        <div class="col-md-6">
          <label for="doctorName" class="form-label fw-bold">Tên Bác Sĩ</label>
          <input
            type="text"
            class="form-control"
            id="doctorName"
            name="doctorName"
            v-model="form.doctorName"
            readonly
            placeholder="Tên bác sĩ sẽ hiển thị tại đây"
          />
        </div>

        <div class="col-md-3" v-if="scheduleType === 'week'">
          <label for="weekStart" class="form-label fw-bold">Chọn Tuần <span class="text-danger">*</span></label>
          <input
            type="date"
            class="form-control"
            id="weekStart"
            name="weekStart"
            v-model="form.weekStart"
            :required="scheduleType === 'week'"
            :min="minWeekStart"
            @change="validateWeek"
          />
          <div class="invalid-feedback">{{ weekError }}</div>
        </div>

        <div class="col-md-3" v-if="scheduleType === 'month'">
          <label for="selectedMonth" class="form-label fw-bold">Chọn Tháng <span class="text-danger">*</span></label>
          <input
            type="month"
            class="form-control"
            id="selectedMonth"
            name="selectedMonth"
            v-model="form.selectedMonth"
            :required="scheduleType === 'month'"
            :min="minMonthStart"
          />
          <div class="invalid-feedback">Vui lòng chọn tháng.</div>
        </div>

      </div>

      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">Khuôn mẫu Lịch Làm Việc</h5>
          <div v-for="(dayName, index) in daysOfWeek" :key="index" class="mb-3">
            <h6 class="fw-bold">{{ dayName }}</h6> <div v-if="form.schedule[dayName].length === 0" class="text-muted">Không có ca làm việc</div>
            <div v-for="(shift, shiftIndex) in form.schedule[dayName]" :key="shiftIndex" class="row g-3 mb-2">
              <div class="col-md-5">
                <label :for="'startTime-' + index + '-' + shiftIndex" class="form-label">Giờ Bắt Đầu</label>
                <input
                  type="time"
                  class="form-control"
                  :id="'startTime-' + index + '-' + shiftIndex"
                  v-model="shift.startTime"
                  required
                  @change="validateShift(dayName, shiftIndex)"
                />
                <div class="invalid-feedback">Vui lòng chọn giờ bắt đầu hợp lệ.</div>
              </div>
              <div class="col-md-5">
                <label :for="'endTime-' + index + '-' + shiftIndex" class="form-label">Giờ Kết Thúc</label>
                <input
                  type="time"
                  class="form-control"
                  :id="'endTime-' + index + '-' + shiftIndex"
                  v-model="shift.endTime"
                  required
                  @change="validateShift(dayName, shiftIndex)"
                />
                <div class="invalid-feedback">Giờ kết thúc phải sau giờ bắt đầu.</div>
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button
                  type="button"
                  class="btn btn-outline-danger w-100"
                  @click="removeShift(dayName, shiftIndex)"
                >
                  Xóa
                </button>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-outline-primary mt-2"
              @click="addShift(dayName)"
            >
              Thêm Ca
            </button>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center gap-3">
        <button type="submit" class="btn btn-primary px-4">Lưu Lịch Làm Việc</button>
        <button type="reset" class="btn btn-secondary px-4" @click="resetForm">Xóa Form</button>
      </div>
    </form>
  </div>
</template>

<script>
import workingTimeService from '../../services/working_time.service'
import WebSocketService from '../../services/ws.service';
export default {
  emits: ['formSubmitted'],
  props :{
    doctors: {type: Array, required: true}
  },
  data() {
    return {
      wsService: new WebSocketService(),
      scheduleType: 'week', // 'week' hoặc 'month'
      form: {
        doctorId: '',
        doctorName: '',
        weekStart: '', // Dùng cho 'week'
        selectedMonth: '', // Dùng cho 'month' (format: YYYY-MM)
        schedule: {
          'Thứ Hai': [],
          'Thứ Ba': [],
          'Thứ Tư': [],
          'Thứ Năm': [],
          'Thứ Sáu': [],
          'Thứ Bảy': [],
          'Chủ Nhật': []
        }
      },
      weekError: 'Vui lòng chọn tuần trong tương lai.',
      minWeekStart: this.getNextMonday(),
      minMonthStart: this.getThisMonth(),
      filteredDoctors: [],
      // CHUYỂN THÀNH MẢNG TĨNH
      daysOfWeek: [
        'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'
      ],
      // Map JS getDay() (0 = CN) sang tên tiếng Việt
      dayNameMap: [
        'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'
      ],
      lichlamviec: { // Giữ lại làm đối tượng tạm
        maBS: '',
        ngaythangnam: '',
        giobatdau: '',
        gioketthuc: ''
      }
    };
  },
  computed: {
    // BỎ COMPUTED 'daysOfWeek' VÌ ĐÃ CHUYỂN VÀO DATA
  },

  methods: {
    getNextMonday() {
      const today = new Date();
      const day = today.getDay();
      const diff = day === 0 ? 1 : 8 - day;
      const nextMonday = new Date(today.setDate(today.getDate() + diff));
      return nextMonday.toISOString().split('T')[0];
    },

    // HÀM MỚI: LẤY THÁNG HIỆN TẠI CHO INPUT 'min'
    getThisMonth() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    },

    // HÀM MỚI: FORMAT NGÀY SANG YYYY-MM-DD CHO API
    formatDateForAPI(date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },

    validateWeek() {
      // (Giữ nguyên logic)
      const selectedDate = new Date(this.form.weekStart);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const input = document.getElementById('weekStart');
      if (selectedDate < today) {
        input.setCustomValidity('Vui lòng chọn tuần trong tương lai.');
        this.weekError = 'Vui lòng chọn tuần trong tương lai.';
      } else {
        input.setCustomValidity('');
        this.weekError = 'Vui lòng chọn tuần trong tương lai.';
      }
    },

    validateShift(dayName, shiftIndex) {
      // SỬA LẠI LOGIC TÌM ID
      const shift = this.form.schedule[dayName][shiftIndex];
      const dayIndex = this.daysOfWeek.findIndex(d => d === dayName);
      const startTimeInput = document.getElementById(`startTime-${dayIndex}-${shiftIndex}`);
      const endTimeInput = document.getElementById(`endTime-${dayIndex}-${shiftIndex}`);
      
      if (!shift.startTime || !shift.endTime) {
        if (startTimeInput) startTimeInput.setCustomValidity('Vui lòng chọn giờ bắt đầu hợp lệ.');
        if (endTimeInput) endTimeInput.setCustomValidity('Vui lòng chọn giờ kết thúc hợp lệ.');
        return;
      }
      const start = new Date(`1970-01-01T${shift.startTime}:00`);
      const end = new Date(`1970-01-01T${shift.endTime}:00`);
      
      if (end <= start) {
        if (endTimeInput) endTimeInput.setCustomValidity('Giờ kết thúc phải sau giờ bắt đầu.');
      } else {
        if (startTimeInput) startTimeInput.setCustomValidity('');
        if (endTimeInput) endTimeInput.setCustomValidity('');
      }
    },

    addShift(dayName) {
      this.form.schedule[dayName].push({ startTime: '', endTime: '' });
    },

    removeShift(dayName, shiftIndex) {
      this.form.schedule[dayName].splice(shiftIndex, 1);
    },

    filterDoctors() {
      // (Giữ nguyên logic)
      const query = this.form.doctorId.toUpperCase();
      this.filteredDoctors = this.doctors.filter(doctor =>
        doctor.maBS.toUpperCase().startsWith(query)
      );
      const matchedDoctor = this.doctors.find(doctor => doctor.maBS.toUpperCase() === query);
      this.form.doctorName = matchedDoctor ? matchedDoctor.tenBS : '';
    },

    // HÀM MỚI: XỬ LÝ LƯU THEO TUẦN
    async handleWeekSubmit() {
      const selectedDate = new Date(this.form.weekStart);
      const dayOfWeek = selectedDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(selectedDate);
      monday.setDate(selectedDate.getDate() + diffToMonday);

      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date);
      }

      for (let i = 0; i < this.daysOfWeek.length; i++) {
        const dayName = this.daysOfWeek[i];
        const shifts = this.form.schedule[dayName];
        if (shifts.length > 0) {
          const formattedDate = this.formatDateForAPI(weekDates[i]); // Dùng YYYY-MM-DD
          for (const shift of shifts) {
            this.lichlamviec = {
              maBS: this.form.doctorId,
              ngaythangnam: formattedDate,
              giobatdau: shift.startTime,
              gioketthuc: shift.endTime
            };
            console.log('Đang lưu (Tuần):', this.lichlamviec);
            await workingTimeService.create(this.lichlamviec);
          }
        }
      }
    },

    // HÀM MỚI: XỬ LÝ LƯU THEO THÁNG
    async handleMonthSubmit() {
      const [year, month] = this.form.selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate(); // month là 1-based, nên 0 là ngày cuối tháng trước
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day); // month - 1 vì Date() là 0-based
        const dayName = this.dayNameMap[currentDate.getDay()];
        
        const shifts = this.form.schedule[dayName];
        if (shifts.length > 0) {
          const formattedDate = this.formatDateForAPI(currentDate); // Dùng YYYY-MM-DD
          for (const shift of shifts) {
            this.lichlamviec = {
              maBS: this.form.doctorId,
              ngaythangnam: formattedDate,
              giobatdau: shift.startTime,
              gioketthuc: shift.endTime
            };
            console.log('Đang lưu (Tháng):', this.lichlamviec);
            await workingTimeService.create(this.lichlamviec);
          }
        }
      }
    },

    // HANDLESUBMIT ĐÃ ĐƯỢC CẤU TRÚC LẠI
    async handleSubmit() {
      const form = document.getElementById('scheduleForm');
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      
      try {
        // Tách logic dựa trên scheduleType
        if (this.scheduleType === 'week') {
          await this.handleWeekSubmit();
        } else {
          await this.handleMonthSubmit();
        }
        
        alert('Lưu lịch làm việc thành công!');
        
        this.wsService.send({
          type: 'created_schedule',
          sender: 'Admin',
          data: this.form.doctorId, // Gửi mã BS
        });

        this.$emit('formSubmitted');
        this.resetForm();

      } catch(error) {
        // Sửa lại thông báo lỗi chung chung hơn
        const errorMessage = error.response?.data?.message || `Thêm lịch làm việc thất bại!`;
        alert(errorMessage);
      }
    },
    
    resetForm() {
      this.form = {
        doctorId: '',
        doctorName: '',
        weekStart: '',
        selectedMonth: '', // THÊM DÒNG NÀY
        schedule: {
          'Thứ Hai': [],
          'Thứ Ba': [],
          'Thứ Tư': [],
          'Thứ Năm': [],
          'Thứ Sáu': [],
          'Thứ Bảy': [],
          'Chủ Nhật': []
        }
      };
      this.scheduleType = 'week'; // THÊM DÒNG NÀY
      this.filteredDoctors = [];
      const form = document.getElementById('scheduleForm');
      form.classList.remove('was-validated');
    },

    // BỎ HÀM `formatDate` (nếu không dùng ở đâu khác)
    // formatDate(date) { ... }
  },

  mounted(){
    this.wsService.connect()
  },

  beforeDestroy() {
    this.wsService.disconnect();
  }
};
</script>

<style scoped>
@import "@/assets/addSchechule.css";
</style>