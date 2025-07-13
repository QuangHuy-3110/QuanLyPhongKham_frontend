<template>
  <div class="container">
    <div class="header">{{ monthLabel }}</div>

    <div class="controls">
      <button @click="prevMonth">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Tháng trước
      </button>
      <button @click="nextMonth">
        Tháng sau
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>

    <div class="month-calendar">
      <div class="day-name" v-for="(dayName, index) in dayNames" :key="`day-${index}`">
        {{ dayName }}
      </div>
      <div
        class="day"
        v-for="(day, index) in days"
        :key="index"
        :class="{ 'empty': !day.date, 'today': isToday(day.date), 'has-value': getDaySessions(day.date).length > 0 }"
      >
        <div class="day-header" v-if="day.date">
          {{ formatDay(day.date) }}
        </div>
        <div class="day-content" v-if="day.date">
          <div
            class="session"
            v-for="(session, sessionIndex) in getDaySessions(day.date)"
            :key="`session-${sessionIndex}`"
          >
            {{ session.giobatdau }} - {{ session.gioketthuc }}
          </div>
          <div class="session" v-if="getDaySessions(day.date).length === 0">
            Trống
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
      monthLabel: '',
      dayNames: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    };
  },
  methods: {
    getFirstDayOfMonth(date) {
      const d = new Date(date);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    },
    getDaysInMonth(date) {
      const d = new Date(date);
      return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    },
    formatDay(date) {
      return date.getDate();
    },
    formatMonthYear(date) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `Tháng ${month}/${year}`;
    },
    isToday(date) {
      if (!date) return false;
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
    getDaySessions(date) {
      if (!date) return [];
      // Chuyển date sang định dạng YYYY-MM-DD theo múi giờ địa phương
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      return this.array.list.filter(item => {
        // Chuyển ngaythangnam sang định dạng YYYY-MM-DD theo múi giờ địa phương
        const itemDate = new Date(item.ngaythangnam);
        const itemYear = itemDate.getFullYear();
        const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
        const itemDay = itemDate.getDate().toString().padStart(2, '0');
        const itemDateString = `${itemYear}-${itemMonth}-${itemDay}`;
        
        return itemDateString === dateString;
      });
    },
    renderMonth() {
      const firstDay = this.getFirstDayOfMonth(this.currentDate);
      const daysInMonth = this.getDaysInMonth(this.currentDate);
      const startDay = firstDay.getDay();
      this.days = [];
      this.monthLabel = this.formatMonthYear(this.currentDate);

      // Tính số ô trống trước ngày đầu tiên của tháng (bắt đầu từ Thứ Hai)
      const offset = startDay === 0 ? 6 : startDay - 1; // Nếu là Chủ Nhật (0) thì offset = 6, nếu là Thứ Hai (1) thì offset = 0, v.v.
      for (let i = 0; i < offset; i++) {
        this.days.push({ date: null });
      }

      // Thêm các ngày của tháng
      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(this.currentDate);
        day.setDate(i);
        this.days.push({ date: day });
      }
    },
    prevMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderMonth();
    },
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderMonth();
    },
  },
  mounted() {
    this.renderMonth();
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

.month-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.day-name {
  padding: 0.75rem;
  background-color: #e9ecef;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.day {
  border: 1px solid #dee2e6;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.day.empty {
  background-color: #e9ecef;
}

.day.today {
  background-color: #e9f5ff;
}

.day.has-value {
  background-color: #d1e7dd;
}

.day-header {
  padding: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  text-align: right;
}

.day-content {
  flex: 1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.session {
  font-size: 0.85rem;
  color: #333;
  background-color: #fff;
  padding: 0.375rem;
  border-radius: 0.375rem;
  text-align: center;
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

  .month-calendar {
    grid-template-columns: repeat(7, 1fr);
  }

  .day {
    min-height: 100px;
  }

  .day-name {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  .day-header {
    font-size: 0.8rem;
  }

  .session {
    font-size: 0.75rem;
    padding: 0.25rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>