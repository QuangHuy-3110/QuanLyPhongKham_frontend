<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">Thêm Lịch Làm Việc Cho Bác Sĩ</h3>
    <hr>
    <form id="scheduleForm" class="needs-validation mt-5" novalidate @submit.prevent="handleSubmit">
      <!-- Mã bác sĩ và tên bác sĩ -->
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
        <div class="col-md-3">
          <label for="weekStart" class="form-label fw-bold">Chọn Tuần <span class="text-danger">*</span></label>
          <input
            type="date"
            class="form-control"
            id="weekStart"
            name="weekStart"
            v-model="form.weekStart"
            required
            :min="minWeekStart"
            @change="validateWeek"
          />
          <div class="invalid-feedback">{{ weekError }}</div>
        </div>
      </div>

      <!-- Lịch tuần -->
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">Lịch Làm Việc Trong Tuần</h5>
          <div v-for="(day, index) in daysOfWeek" :key="index" class="mb-3">
            <h6 class="fw-bold">{{ day.name }} ({{ formatDate(day.date) }})</h6>
            <div v-if="form.schedule[day.name].length === 0" class="text-muted">Không có ca làm việc</div>
            <div v-for="(shift, shiftIndex) in form.schedule[day.name]" :key="shiftIndex" class="row g-3 mb-2">
              <div class="col-md-5">
                <label :for="'startTime-' + index + '-' + shiftIndex" class="form-label">Giờ Bắt Đầu</label>
                <input
                  type="time"
                  class="form-control"
                  :id="'startTime-' + index + '-' + shiftIndex"
                  v-model="shift.startTime"
                  required
                  @change="validateShift(day.name, shiftIndex)"
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
                  @change="validateShift(day.name, shiftIndex)"
                />
                <div class="invalid-feedback">Giờ kết thúc phải sau giờ bắt đầu.</div>
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button
                  type="button"
                  class="btn btn-outline-danger w-100"
                  @click="removeShift(day.name, shiftIndex)"
                >
                  Xóa
                </button>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-outline-primary mt-2"
              @click="addShift(day.name)"
            >
              Thêm Ca
            </button>
          </div>
        </div>
      </div>

      <!-- Nút điều khiển -->
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
      form: {
        doctorId: '',
        doctorName: '',
        weekStart: '',
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
      filteredDoctors: [],
      lichlamviec: {
        maBS: '',
        ngaythangnam: '',
        giobatdau: '',
        gioketthuc: ''
      }
    };
  },
  computed: {
    daysOfWeek() {
      if (!this.form.weekStart) return [];
      const selectedDate = new Date(this.form.weekStart);
      const dayOfWeek = selectedDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(selectedDate);
      monday.setDate(selectedDate.getDate() + diffToMonday);
      return [
        { name: 'Thứ Hai', date: new Date(monday) },
        { name: 'Thứ Ba', date: new Date(monday.setDate(monday.getDate() + 1)) },
        { name: 'Thứ Tư', date: new Date(monday.setDate(monday.getDate() + 1)) },
        { name: 'Thứ Năm', date: new Date(monday.setDate(monday.getDate() + 1)) },
        { name: 'Thứ Sáu', date: new Date(monday.setDate(monday.getDate() + 1)) },
        { name: 'Thứ Bảy', date: new Date(monday.setDate(monday.getDate() + 1)) },
        { name: 'Chủ Nhật', date: new Date(monday.setDate(monday.getDate() + 1)) }
      ];
    }
  },

  methods: {
    getNextMonday() {
      const today = new Date();
      const day = today.getDay();
      const diff = day === 0 ? 1 : 8 - day;
      const nextMonday = new Date(today.setDate(today.getDate() + diff));
      return nextMonday.toISOString().split('T')[0];
    },

    validateWeek() {
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

    validateShift(day, shiftIndex) {
      const shift = this.form.schedule[day][shiftIndex];
      const startTimeInput = document.getElementById(`startTime-${this.daysOfWeek.findIndex(d => d.name === day)}-${shiftIndex}`);
      const endTimeInput = document.getElementById(`endTime-${this.daysOfWeek.findIndex(d => d.name === day)}-${shiftIndex}`);
      if (!shift.startTime || !shift.endTime) {
        startTimeInput.setCustomValidity('Vui lòng chọn giờ bắt đầu hợp lệ.');
        endTimeInput.setCustomValidity('Vui lòng chọn giờ kết thúc hợp lệ.');
        return;
      }
      const start = new Date(`1970-01-01T${shift.startTime}:00`);
      const end = new Date(`1970-01-01T${shift.endTime}:00`);
      if (end <= start) {
        endTimeInput.setCustomValidity('Giờ kết thúc phải sau giờ bắt đầu.');
      } else {
        startTimeInput.setCustomValidity('');
        endTimeInput.setCustomValidity('');
      }
    },

    addShift(day) {
      this.form.schedule[day].push({ startTime: '', endTime: '' });
    },

    removeShift(day, shiftIndex) {
      this.form.schedule[day].splice(shiftIndex, 1);
    },

    filterDoctors() {
      const query = this.form.doctorId.toUpperCase();
      this.filteredDoctors = this.doctors.filter(doctor =>
        doctor.maBS.toUpperCase().startsWith(query)
      );
      // Auto-fill doctor name if exact match is found
      const matchedDoctor = this.doctors.find(doctor => doctor.maBS.toUpperCase() === query);
      this.form.doctorName = matchedDoctor ? matchedDoctor.tenBS : '';
    },

    async handleSubmit() {
      const form = document.getElementById('scheduleForm');
      if (form.checkValidity()) {
        this.lichlamviec.maBS = this.form.doctorId;

        // Duyệt qua các ngày trong lịch
        for (const day of Object.keys(this.form.schedule)) {
          if (this.form.schedule[day].length > 0) {
            const dayInfo = this.daysOfWeek.find(d => d.name === day);
            const formattedDate = dayInfo ? this.formatDate(dayInfo.date) : '';
            this.lichlamviec.ngaythangnam = formattedDate;

            // Duyệt qua các ca làm việc trong ngày
            for (const shift of this.form.schedule[day]) {
              this.lichlamviec.giobatdau = shift.startTime;
              this.lichlamviec.gioketthuc = shift.endTime;
              console.log(this.lichlamviec);
              await workingTimeService.create(this.lichlamviec); // Gọi API tạo lịch
            }
          }
        }
        console.log('===========================');
        alert('Lưu lịch làm việc thành công!');
        
        this.wsService.send({
          type: 'created_schedule',
          sender: 'Admin',
          data: this.lichlamviec.maBS,
        });

        this.$emit('formSubmitted');
        this.resetForm();
      } else {
        form.classList.add('was-validated');
      }
    },
    
    resetForm() {
      this.form = {
        doctorId: '',
        doctorName: '',
        weekStart: '',
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
      this.filteredDoctors = [];
      const form = document.getElementById('scheduleForm');
      form.classList.remove('was-validated');
    },
    formatDate(date) {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
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