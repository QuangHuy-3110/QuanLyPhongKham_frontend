<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">Xem Lịch Làm Việc</h3>
    <hr>
    <div class="card shadow-sm border-0 mb-4 pt-2">
      <div class="card-body" id="scheduleForm">
        <div class="row g-3 mb-4">
          <!-- Chế độ xem -->
          <div class="col-md-4">
            <label for="viewMode" class="form-label fw-bold">Chế độ xem <span class="text-danger">*</span></label>
            <select id="viewMode" class="form-select" v-model="viewMode" @change="resetSelection">
              <option value="doctor">Theo bác sĩ</option>
              <option value="specialty">Theo chuyên khoa</option>
            </select>
          </div>

          <!-- Nhập mã bác sĩ hoặc chọn chuyên khoa -->
          <div class="col-md-4">
            <label v-if="viewMode === 'doctor'" for="doctorId" class="form-label fw-bold">Mã Bác Sĩ <span class="text-danger">*</span></label>
            <label v-else for="specialtyId" class="form-label fw-bold">Chọn Chuyên Khoa <span class="text-danger">*</span></label>

            <input
              v-if="viewMode === 'doctor'"
              type="text"
              class="form-control"
              id="doctorId"
              v-model="form.doctorId"
              pattern="[A-Za-z0-9]{6,20}"
              placeholder="Nhập mã bác sĩ (6-20 ký tự)"
              required
            />

            <select
              v-else
              id="specialtyId"
              class="form-select"
              v-model="form.specialtyId"
              required
            >
              <option value="" disabled>Chọn chuyên khoa</option>
              <option v-for="specialty in specialties" :key="specialty.maCK" :value="specialty.maCK">
                {{ specialty.tenCK }}
              </option>
            </select>

            <div class="invalid-feedback">
              {{ viewMode === 'doctor' ? 'Vui lòng nhập mã bác sĩ hợp lệ.' : 'Vui lòng chọn chuyên khoa.' }}
            </div>
          </div>

          <!-- Chọn tháng -->
          <div class="col-md-4">
            <label for="month" class="form-label fw-bold">Chọn Tháng <span class="text-danger">*</span></label>
            <input
              type="month"
              class="form-control"
              id="month"
              v-model="form.month"
              required
              @change="validateMonth"
            />
            <div class="invalid-feedback" v-if="monthError">{{ monthError }}</div>
          </div>
        </div>

        <!-- Lịch -->
        <div v-if="form.month" class="calendar mt-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <button class="btn btn-outline-primary" @click="prevMonth">Tháng trước</button>
            <h5 class="mb-0">{{ formatMonth(form.month) }}</h5>
            <button class="btn btn-outline-primary" @click="nextMonth">Tháng sau</button>
          </div>
          <div class="calendar-grid">
            <div class="calendar-header" v-for="day in ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']" :key="day">
              {{ day }}
            </div>
            <div
              v-for="day in calendarDays"
              :key="day.date ? day.date.toISOString() : Math.random()"
              class="calendar-day"
              :class="{ 'empty': !day.date, 'has-schedule': day.schedules && day.schedules.length > 0 }"
              @click="day.date && day.schedules && day.schedules.length > 0 && showDoctorModal(day.date)"
            >
              <div v-if="day.date" class="day-number">{{ day.date.getDate() }}</div>
              <div v-if="day.schedules && day.schedules.length > 0" class="schedule-content">
                <div v-if="viewMode === 'doctor'" v-for="schedule in day.schedules" :key="schedule.giobatdau">
                  {{ schedule.giobatdau }} - {{ schedule.gioketthuc }} - {{ schedule.trangthai || 'Chưa chấm công' }}
                </div>
                <div v-else v-for="doctor in day.schedules" :key="doctor.maBS">
                  {{ doctor.maBS }} - {{ doctor.tenBS }} - {{ doctor.trangthai || 'Chưa chấm công' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-muted">Vui lòng chọn tháng để xem lịch.</div>
      </div>
    </div>

    <!-- Modal hiển thị danh sách bác sĩ -->
    <div class="modal fade" id="doctorModal" tabindex="-1" aria-labelledby="doctorModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="doctorModalLabel">Danh sách bác sĩ làm việc ngày {{ selectedDate ? selectedDate.toLocaleDateString('vi-VN') : '' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="doctorsOnSelectedDate.length > 0">
              <template v-if="viewMode === 'doctor'">
                <ul class="list-group">
                  <li v-for="doctor in doctorsOnSelectedDate" :key="doctor.maBS + doctor.giobatdau" class="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {{ doctor.maBS }} - {{ doctor.tenBS }} - {{ doctor.trangthai || 'Chưa chấm công' }} ({{ doctor.giobatdau }} - {{ doctor.gioketthuc }})
                    </span>
                    <span v-if="!doctor.trangthai">
                      <button class="btn btn-warning btn-sm me-2" @click="update_status('Nghỉ', doctor)">Nghỉ</button>
                      <button class="btn btn-success btn-sm me-2" @click="update_status('Hoàn thành', doctor)">Hoàn thành</button>
                      <button class="btn btn-danger btn-sm" @click="delete_schedule(doctor)">Xóa</button>
                    </span>
                  </li>
                </ul>
              </template>
              <template v-else>
                <ul class="list-group">
                  <li v-for="doctor in doctorsOnSelectedDate" :key="doctor.maBS" class="list-group-item">
                    <strong>{{ doctor.maBS }} - {{ doctor.tenBS }}</strong>
                    <ul class="mt-2">
                      <li v-for="schedule in doctor.schedules" :key="schedule.giobatdau" class="ms-3 mb-2">
                        {{ schedule.giobatdau }} - {{ schedule.gioketthuc }} - {{ schedule.trangthai || 'Chưa chấm công' }}
                        <button v-if="!schedule.trangthai" class="btn btn-warning btn-sm me-2" @click="update_status('Nghỉ', doctor, schedule)">Nghỉ</button>
                        <button v-if="!schedule.trangthai" class="btn btn-success btn-sm me-2" @click="update_status('Hoàn thành', doctor, schedule)">Hoàn thành</button>
                        <button v-if="!schedule.trangthai" class="btn btn-danger btn-sm" @click="delete_schedule(doctor)">Xóa</button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </template>
            </div>
            <p v-else class="text-muted">Không có bác sĩ làm việc trong ngày này.</p>
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
import working_timeService from '../../services/working_time.service';

export default {
  props: {
    doctors: { type: Array, required: true },
    specialties: { type: Array, required: true },
    schedules: { type: Array, required: true }
  },
  data() {
    return {
      viewMode: 'doctor',
      form: {
        doctorId: '',
        specialtyId: '',
        month: ''
      },
      monthError: '',
      selectedDate: null,
      doctorsOnSelectedDate: []
    };
  },
  computed: {
    calendarDays() {
      if (!this.form.month) return [];
      const [year, month] = this.form.month.split('-').map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const startDay = firstDay.getDay();
      const offset = startDay === 0 ? -6 : 1 - startDay;
      const currentDay = new Date(firstDay);
      currentDay.setDate(firstDay.getDate() + offset);
      const days = [];

      for (let i = 0; i < 42; i++) {
        const date = new Date(currentDay);
        const isCurrentMonth = date.getMonth() === month - 1 && date.getFullYear() === year;
        const schedules = isCurrentMonth ? this.getSchedulesForDate(date) : [];
        days.push({
          date: isCurrentMonth ? date : null,
          schedules
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      return days;
    }
  },
  watch: {
    'schedules': {
      handler(newValue) {
        if (newValue) {
          this.selectedRow = null;
          this.editRow = null;
          this.isEditing = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async update_status(status, doctor, schedule = null) {
      try {
        const dateStr = this.toLocalDateString(this.selectedDate);
        let targetSchedule;

        if (this.viewMode === 'doctor') {
          targetSchedule = this.schedules.find(s => 
            s.maBS === doctor.maBS && 
            new Date(s.ngaythangnam).toLocaleDateString('en-CA') === dateStr &&
            s.giobatdau === doctor.giobatdau &&
            s.gioketthuc === doctor.gioketthuc
          );
        } else {
          targetSchedule = this.schedules.find(s => 
            s.maBS === doctor.maBS && 
            new Date(s.ngaythangnam).toLocaleDateString('en-CA') === dateStr &&
            s.giobatdau === schedule.giobatdau &&
            s.gioketthuc === schedule.gioketthuc
          );
        }

        if (!targetSchedule) {
          console.error('Không tìm thấy lịch làm việc phù hợp');
          return;
        }

        const formattedDate = new Date(targetSchedule.ngaythangnam).toLocaleDateString('en-CA');
        const updatedSchedule = { 
          ...targetSchedule, 
          trangthai: status, 
          ngaythangnam: formattedDate 
        };

        await working_timeService.update(
          doctor.maBS, 
          formattedDate, 
          targetSchedule.giobatdau, 
          updatedSchedule
        );

        alert("Chấm công thành công!");

        if (this.viewMode === 'doctor') {
          this.doctorsOnSelectedDate = this.doctorsOnSelectedDate.map(d =>
            d.maBS === doctor.maBS &&
            d.giobatdau === doctor.giobatdau &&
            d.gioketthuc === doctor.gioketthuc
              ? { ...d, trangthai: status }
              : d
          );
        } else {
          this.doctorsOnSelectedDate = this.doctorsOnSelectedDate.map(d =>
            d.maBS === doctor.maBS
              ? {
                  ...d,
                  schedules: d.schedules.map(s =>
                    s.giobatdau === schedule.giobatdau && s.gioketthuc === schedule.gioketthuc
                      ? { ...s, trangthai: status }
                      : s
                  )
                }
              : d
          );
        }

        this.$emit('update:schedules');
        this.$forceUpdate();
      } catch (error) {
        // console.error('Lỗi khi cập nhật trạng thái lịch làm việc:', error);
        // alert('Lỗi khi chấm công: ' + error.message);
        const errorMessage = error.response?.data?.message || 'Lỗi khi chấm công!';
        alert(errorMessage);
      }
    },
    
    delete_schedule(doctor) {
      const dateStr = this.toLocalDateString(this.selectedDate);
      let targetSchedule;

      if (this.viewMode === 'doctor') {
        targetSchedule = this.schedules.find(s => 
          s.maBS === doctor.maBS && 
          new Date(s.ngaythangnam).toLocaleDateString('en-CA') === dateStr &&
          s.giobatdau === doctor.giobatdau &&
          s.gioketthuc === doctor.gioketthuc
        );
      } else {
        targetSchedule = this.schedules.find(s => 
          s.maBS === doctor.maBS && 
          new Date(s.ngaythangnam).toLocaleDateString('en-CA') === dateStr &&
          s.giobatdau === doctor.schedules[0].giobatdau &&
          s.gioketthuc === doctor.schedules[0].gioketthuc
        );
      }

      if (!targetSchedule) {
        console.error('Không tìm thấy lịch làm việc phù hợp');
        return;
      }

      working_timeService.delete(doctor.maBS, dateStr, targetSchedule.giobatdau)
        .then(() => {
          alert("Xóa lịch làm việc thành công!");
          this.doctorsOnSelectedDate = this.doctorsOnSelectedDate.filter(d =>
            !(d.maBS === doctor.maBS && d.giobatdau === doctor.giobatdau && d.gioketthuc === doctor.gioketthuc)
          );
          this.$emit('update:schedules');
        })
        .catch(error => {
          const errorMessage = error.response?.data?.message || 'Lỗi khi xóa lịch làm việc!';
          alert(errorMessage);
        });
    },

    getSchedulesForDate(date) {
      const dateStr = this.toLocalDateString(date);
      if (this.viewMode === 'doctor') {
        const uniqueSchedules = [];
        const seen = new Set();
        this.schedules.forEach((s) => {
          const scheduleDate = new Date(s.ngaythangnam).toLocaleDateString('en-CA');
          const key = `${s.maBS}-${scheduleDate}-${s.giobatdau}`;
          if (s.maBS === this.form.doctorId && scheduleDate === dateStr && !seen.has(key)) {
            uniqueSchedules.push(s);
            seen.add(key);
          }
        });
        return uniqueSchedules;
      } else {
        const specialtyDoctors = this.doctors.filter(
          (d) => d.maCK === this.form.specialtyId
        );
        const doctorSchedules = {};
        specialtyDoctors.forEach((doctor) => {
          const doctorSchedulesList = this.schedules
            .filter((s) => {
              const scheduleDate = new Date(s.ngaythangnam).toLocaleDateString('en-CA');
              return s.maBS === doctor.maBS && scheduleDate === dateStr;
            })
            .map((s) => ({
              giobatdau: s.giobatdau,
              gioketthuc: s.gioketthuc,
              trangthai: s.trangthai
            }));
          if (doctorSchedulesList.length > 0) {
            doctorSchedules[doctor.maBS] = {
              maBS: doctor.maBS,
              tenBS: doctor.tenBS,
              schedules: doctorSchedulesList
            };
          }
        });
        return Object.values(doctorSchedules);
      }
    },
    toLocalDateString(date) {
      return date.toLocaleDateString('en-CA');
    },
    resetSelection() {
      this.form.doctorId = '';
      this.form.specialtyId = '';
      const form = document.getElementById('scheduleForm');
      if (form) form.classList.remove('was-validated');
    },
    prevMonth() {
      const [year, month] = this.form.month.split('-').map(Number);
      const newMonth = new Date(year, month - 2, 1);
      this.form.month = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`;
      this.validateMonth();
    },
    nextMonth() {
      const [year, month] = this.form.month.split('-').map(Number);
      const newMonth = new Date(year, month, 1);
      this.form.month = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`;
      this.validateMonth();
    },
    formatMonth(month) {
      const [year, monthNum] = month.split('-').map(Number);
      return new Date(year, monthNum - 1).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    },
    showDoctorModal(date) {
      this.selectedDate = date;
      const dateStr = this.toLocalDateString(date);
      this.doctorsOnSelectedDate = [];

      if (this.viewMode === 'doctor') {
        const uniqueDoctors = new Set();
        this.schedules.forEach((schedule) => {
          const scheduleDate = new Date(schedule.ngaythangnam).toLocaleDateString('en-CA');
          if (scheduleDate === dateStr && schedule.maBS === this.form.doctorId && !uniqueDoctors.has(schedule.maBS + schedule.giobatdau)) {
            const doctor = this.doctors.find((d) => d.maBS === schedule.maBS);
            if (doctor) {
              this.doctorsOnSelectedDate.push({
                maBS: doctor.maBS,
                tenBS: doctor.tenBS,
                giobatdau: schedule.giobatdau,
                gioketthuc: schedule.gioketthuc,
                trangthai: schedule.trangthai
              });
              uniqueDoctors.add(schedule.maBS + schedule.giobatdau);
            }
          }
        });
      } else {
        const uniqueDoctors = new Set();
        this.schedules.forEach((schedule) => {
          const scheduleDate = new Date(schedule.ngaythangnam).toLocaleDateString('en-CA');
          if (scheduleDate === dateStr && !uniqueDoctors.has(schedule.maBS)) {
            const doctor = this.doctors.find((d) => d.maBS === schedule.maBS);
            if (doctor && doctor.maCK === this.form.specialtyId) {
              const doctorSchedules = this.schedules
                .filter(s => s.maBS === doctor.maBS && new Date(s.ngaythangnam).toLocaleDateString('en-CA') === dateStr)
                .map(s => ({
                  giobatdau: s.giobatdau,
                  gioketthuc: s.gioketthuc,
                  trangthai: s.trangthai
                }));
              this.doctorsOnSelectedDate.push({
                maBS: doctor.maBS,
                tenBS: doctor.tenBS,
                schedules: doctorSchedules
              });
              uniqueDoctors.add(schedule.maBS);
            }
          }
        });
      }

      const modal = new Modal(document.getElementById('doctorModal'));
      modal.show();
    }
  }
};
</script>

<style scoped>
@import "@/assets/workSchedual.css";
</style>