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

              <div class="session">
                  <div class="session-title">Buổi sáng</div>
                  <div class="session-content">Trống</div>
              </div>

              <div class="session">
                  <div class="session-title">Buổi chiều</div>
                  <div class="session-content">Trống</div>
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
      /* Thêm gạch ngang giữa các ngày */
      display: flex;
      flex-direction: column;
      transition: background 0.3s ease;
  }

  .day:last-child {
      border-right: none;
  }

  .day-header {
      padding: 16px;
      background: #f9fafb;
      font-weight: 600;
      font-size: 16px;
      color: #111827;
      border-bottom: 1px solid #e5e7eb;
      text-align: center;
  }

  .session {
      flex: 1;
      padding: 16px;
      border-bottom: 1px solid #d1d5db;
      /* Gạch ngang giữa các phiên */
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .session:last-child {
      border-bottom: none;
      /* Xóa gạch ngang cho phiên cuối */
  }

  .session-title {
      font-weight: 600;
      font-size: 14px;
      color: #1f2937;
  }

  .session-content {
      font-size: 14px;
      color: #3b82f6;
      background: #eff6ff;
      padding: 8px;
      border-radius: 6px;
      text-align: center;
  }

  @media (max-width: 768px) {
      .container {
          padding: 16px;
      }

      .header {
          font-size: 24px;
      }

      .week-calendar {
          grid-template-columns: 1fr;
      }

      .day {
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          /* Gạch ngang giữa các ngày trên mobile */
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
  }
</style>