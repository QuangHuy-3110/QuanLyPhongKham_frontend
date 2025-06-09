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
          :class="{ 'empty': !day.date, 'today': isToday(day.date) }"
        >
          <div class="day-header" v-if="day.date">
            {{ formatDay(day.date) }}
          </div>
          <div class="day-content" v-if="day.date">
            <div class="session">Trống</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentDate: new Date(),
        days: [],
        monthLabel: '',
        dayNames: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
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
      renderMonth() {
        const firstDay = this.getFirstDayOfMonth(this.currentDate);
        const daysInMonth = this.getDaysInMonth(this.currentDate);
        const startDay = firstDay.getDay();
        this.days = [];
        this.monthLabel = this.formatMonthYear(this.currentDate);
  
        // Add empty slots for days before the first day of the month
        for (let i = 0; i < startDay; i++) {
          this.days.push({ date: null });
        }
  
        // Add days of the month
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
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 32px;
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .header {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
  }
  
  .controls {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
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
  
  .month-calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    max-width: 1280px;
    width: 100%;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }
  
  .day-name {
    padding: 16px;
    background: #f9fafb;
    font-weight: 600;
    font-size: 14px;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
    text-align: center;
  }
  
  .day {
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    transition: background 0.3s ease;
  }
  
  .day:last-child {
    border-right: none;
  }
  
  .day.empty {
    background: #f9fafb;
  }
  
  .day.today {
    background: #eff6ff;
  }
  
  .day-header {
    padding: 8px;
    font-weight: 600;
    font-size: 14px;
    color: #111827;
    text-align: right;
  }
  
  .day-content {
    flex: 1;
    padding: 8px;
  }
  
  .session {
    font-size: 12px;
    color: #3b82f6;
    background: #eff6ff;
    padding: 6px;
    border-radius: 4px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 16px;
    }
  
    .header {
      font-size: 24px;
    }
  
    .month-calendar {
      grid-template-columns: repeat(7, 1fr);
    }
  
    .day {
      min-height: 80px;
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
  
    .session {
      font-size: 10px;
      padding: 4px;
    }
  }
  </style>