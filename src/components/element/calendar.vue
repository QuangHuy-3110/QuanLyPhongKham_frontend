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
              <div v-for="appt in getAppointments(day.date, 'morning')" :key="appt.maBS" class="appointment">
                {{ appt.giobatdau }} - {{ appt.gioketthuc }}
              </div>
            </template>
            <template v-else>Trống</template>
          </div>
        </div>
        <div class="session" :class="{ 'has-value': getAppointments(day.date, 'afternoon').length > 0 }">
          <div class="session-title">Buổi chiều</div>
          <div class="session-content">
            <template v-if="getAppointments(day.date, 'afternoon').length">
              <div v-for="appt in getAppointments(day.date, 'afternoon')" :key="appt.maBS" class="appointment">
                {{ appt.giobatdau }} - {{ appt.gioketthuc }}
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
      dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
    };
  },
  methods: {
    getSunday(date) {
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
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
      const startSunday = this.getSunday(this.currentDate);
      this.days = [];

      for (let i = 0; i < 7; i++) {
        const day = new Date(startSunday);
        day.setDate(startSunday.getDate() + i);
        this.days.push({
          date: day,
          label: `${this.dayNames[i]} (${this.formatDate(day)})`,
        });
      }

      const endSaturday = new Date(startSunday);
      endSaturday.setDate(startSunday.getDate() + 6);
      this.weekLabel = `Tuần từ ${this.formatDate(startSunday)} đến ${this.formatDate(endSaturday)}`;
    },
    prevWeek() {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.renderWeek();
    },
    nextWeek() {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
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
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 32px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  text-align: center;
}

.controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563eb;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

.icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.week-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  max-width: 1280px;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.day {
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  min-height: 160px; /* Tăng chiều cao để hiển thị tốt hơn */
}

.day:last-child {
  border-right: none;
}

.day-header {
  padding: 12px;
  background: #f9fafb;
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session {
  flex: 1;
  padding: 12px;
  border-bottom: 1px solid #d1d5db;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.session.has-value {
  background: #fefcbf; /* Màu vàng nhạt cho buổi có dữ liệu */
}

.session:last-child {
  border-bottom: none;
}

.session-title {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 8px;
  text-align: center;
}

.session-content {
  font-size: 14px;
  color: #3b82f6;
  background: #eff6ff;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
  width: 90%;
  word-wrap: break-word;
}

.appointment {
  margin: 4px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .header {
    font-size: 20px;
  }

  .controls {
    gap: 8px;
  }

  .week-calendar {
    grid-template-columns: 1fr;
  }

  .day {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    min-height: 120px;
  }

  .day:last-child {
    border-bottom: none;
  }

  button {
    padding: 10px 16px;
    font-size: 14px;
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  .day-header {
    font-size: 12px;
  }

  .session-title {
    font-size: 12px;
  }

  .session-content {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style>
```