```vue
<template>
  <div class="container">
    <div class="header">{{ weekLabel }}</div>

    <div class="controls">
      <button @click="prevWeek">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Tuần trước
      </button>
      <button @click="nextWeek">
        Tuần sau
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>

    <div class="week-calendar">
      <div class="day" v-for="(day, index) in days" :key="index">
        <div class="day-header">{{ day.label }}</div>
        <div class="session" :class="{ 'has-value': getAppointments(day.date, 'morning').length > 0 }">
          <div class="session-title">Buổi sáng</div>
          <div class="session-content">
            <template v-if="getAppointments(day.date, 'morning').length">
              <div v-for="appt in getAppointments(day.date, 'morning')" :key="appt.maBS" 
                   class="appointment" 
                   :class="{ 'selected': isSelected(day.date, appt.giobatdau, appt.gioketthuc) }"
                   @click="getdate(day, appt.giobatdau, appt.gioketthuc, appt.trangthai)">
                {{ appt.giobatdau }} - {{ appt.gioketthuc }} - {{ appt.trangthai }}
              </div>
            </template>
            <template v-else>Trống</template>
          </div>
        </div>
        <div class="session" :class="{ 'has-value': getAppointments(day.date, 'afternoon').length > 0 }">
          <div class="session-title">Buổi chiều</div>
          <div class="session-content">
            <template v-if="getAppointments(day.date, 'afternoon').length" >
              <div v-for="appt in getAppointments(day.date, 'afternoon')" :key="appt.maBS" 
                   class="appointment" 
                   :class="{ 'selected': isSelected(day.date, appt.giobatdau, appt.gioketthuc) }"
                   @click="getdate(day, appt.giobatdau, appt.gioketthuc, appt.trangthai)">
                {{ appt.giobatdau }} - {{ appt.gioketthuc }} - {{ appt.trangthai }}
              </div>
            </template>
            <template v-else>Trống</template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['getdate'],
  props: {
    array: {
      type: Object,
      required: true,
      validator: (data) => {
        return 'list' in data && Array.isArray(data.list);
      },
    },
    columns: {
      type: Array,
      required: true,
      default: () => [],
      validator: (cols) => {
        return cols.every((col) => 'key' in col && 'header' in col);
      },
    },
  },
  data() {
    return {
      currentDate: new Date(),
      days: [],
      weekLabel: '',
      dayNames: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'],
      selectedAppointment: null, // Lưu thông tin ô được chọn
    };
  },
  methods: {
    getdate(day, min, max, trangthai) {
      const d = new Date(day.date);
      d.setDate(d.getDate() + 1); // Cộng thêm 1 ngày để hiển thị đúng giá trị
      const formattedDate = d.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
      this.selectedAppointment = { date: formattedDate, giobatdau: min, gioketthuc: max }; // Cập nhật ô được chọn
      this.$emit('getdate', formattedDate, min, max, trangthai);
    },

    isSelected(date, giobatdau, gioketthuc) {
      if (!this.selectedAppointment) return false;
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      const formattedDate = d.toISOString().split('T')[0];
      return (
        this.selectedAppointment.date === formattedDate &&
        this.selectedAppointment.giobatdau === giobatdau &&
        this.selectedAppointment.gioketthuc === gioketthuc
      );
    },

    getMonday(date) {
      const d = new Date(date);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Nếu là Chủ Nhật (0), lùi 6 ngày; nếu không, lùi về Thứ Hai
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      return d;
    },
    formatDate(d) {
      const dd = d.getDate().toString().padStart(2, '0');
      const mm = (d.getMonth() + 1).toString().padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    },
    getAppointments(date, session) {
      if (!this.array?.list || !Array.isArray(this.array.list)) return [];
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${day}/${month}/${year}`;

      return this.array.list.filter((appt) => {
        const apptDate = new Date(appt.ngaythangnam);
        const apptYear = apptDate.getFullYear();
        const apptMonth = (apptDate.getMonth() + 1).toString().padStart(2, '0');
        const apptDay = apptDate.getDate().toString().padStart(2, '0');
        const apptFormattedDate = `${apptDay}/${apptMonth}/${apptYear}`;

        const startHour = parseInt((appt.giobatdau || '00:00:00').split(':')[0], 10);
        const apptSession = startHour < 12 ? 'morning' : 'afternoon';

        return apptFormattedDate === formattedDate && apptSession === session;
      });
    },
    renderWeek() {
      const startMonday = this.getMonday(this.currentDate);
      this.days = [];

      for (let i = 0; i < 7; i++) {
        const day = new Date(startMonday);
        day.setDate(startMonday.getDate() + i);
        this.days.push({
          date: day,
          label: `${this.dayNames[i]} (${this.formatDate(day)})`,
        });
      }

      const endSunday = new Date(startMonday);
      endSunday.setDate(startMonday.getDate() + 6);
      this.weekLabel = `Tuần từ ${this.formatDate(startMonday)} đến ${this.formatDate(endSunday)}`;
    },
    prevWeek() {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.selectedAppointment = null; // Xóa lựa chọn khi chuyển tuần
      this.renderWeek();
    },
    nextWeek() {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.selectedAppointment = null; // Xóa lựa chọn khi chuyển tuần
      this.renderWeek();
    },
  },
  mounted() {
    this.renderWeek();
  },
};
</script>

<style scoped>
.container {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.header {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.week-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.day {
  border: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  min-height: 150px;
}

.day-header {
  padding: 0.75rem;
  background-color: #e9ecef;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.session {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
}

.session.has-value {
  background-color: #d1e7dd;
}

.session-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
}

.session-content {
  font-size: 0.85rem;
  color: #333;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
  width: 90%;
  word-wrap: break-word;
}

.appointment {
  margin: 0.25rem 0;
  text-align: center;
  cursor: pointer;
  padding: 0.25rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: border-color 0.2s ease;
}

.appointment.selected {
  border: 2px solid #007bff; /* Viền đậm khi được chọn */
  font-weight: 600; /* Tùy chọn: làm chữ đậm để nổi bật */
}

@media (max-width: 768px) {
  .container {
    margin: 1rem;
  }

  .header {
    font-size: 1.25rem;
  }

  .controls {
    gap: 0.5rem;
  }

  .week-calendar {
    grid-template-columns: 1fr;
  }

  .day {
    border: 1px solid #dee2e6;
    min-height: 120px;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }

  .day-header {
    font-size: 0.8rem;
  }

  .session-title {
    font-size: 0.8rem;
  }

  .session-content {
    font-size: 0.75rem;
    padding: 0.375rem;
  }

  .appointment.selected {
    border: 2px solid #007bff; /* Giữ viền đậm cho giao diện mobile */
  }
}
</style>
```