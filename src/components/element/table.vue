<template>
  <!-- Bộ lọc ngày khi name là "lichhen" -->
  <div v-if="name === 'lichhen'" class="mb-4 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm filter-section">
    <div class="flex items-center gap-4 filter-controls">
      <label for="filterDate" class="form-label font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">Lọc theo ngày:</label>
      <input
        type="date"
        id="filterDate"
        class="form-control rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 focus:ring-2 focus:ring-blue-500 w-44"
        v-model="filterDate"
      />
      <button
        class="btn btn-secondary px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        @click="resetFilterDate"
      >
        Đặt lại
      </button>
    </div>
    <!-- <span class="text-sm text-gray-500 dark:text-gray-400 date-display"> -->
      <h5 class="my-3">{{ filterDate === new Date().toISOString().split('T')[0] ? 'Hôm nay' : formatDate(filterDate) }}</h5>
    <!-- </span> -->
  </div>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-100 uppercase bg-gray-700 dark:bg-gray-900 dark:text-gray-200 bg-secondary-subtle">
        <tr>
          <th v-for="col in columns" :key="col.key" scope="col" class="px-4 py-3 min-w-[100px]">
            {{ col.header }}
          </th>
        </tr>
      </thead>
      <tbody id="tbody">
        <tr
          v-for="(row, index) in filteredList"
          :key="index"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-600"
          @click="updateActiveIndex(index)"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <td v-for="col in columns" :key="col.key" class="px-4 py-4">
            {{ col.key.includes('ngay') ? formatDate(row[col.key]) : row[col.key] || '' }}
          </td>
        </tr>
        <tr v-if="!filteredList || filteredList.length === 0">
          <td :colspan="columns.length" class="px-4 py-4 text-center">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div v-if="name === 'lichhen'" class="mt-4">
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Chi tiết lịch hẹn</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="filteredList[activeIndex]">
              <div v-for="col in columns_full" :key="col.key" class="mb-2">
                <strong>{{ col.header }}:</strong>
                {{ col.key.includes('ngay') ? formatDate(filteredList[activeIndex][col.key]) : filteredList[activeIndex][col.key] || 'Không có dữ liệu' }}
              </div>
            </div>
            <div v-else>
              Không có thông tin chi tiết
            </div>
          </div>
          <div class="modal-footer">
            <button v-if="role !== 'patient'" type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="check_profile(filteredList[activeIndex], 'patient')">Xem hồ sơ bệnh nhân</button>
            <button v-if="role !== 'patient' && filteredList[activeIndex] && isToday(filteredList[activeIndex].ngaythangnam)" type="button" class="btn btn-warning" data-bs-dismiss="modal" @click="check_profile(filteredList[activeIndex], 'doctor')">Khám bệnh</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppointmentService from '@/services/appointment.service';
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
    columns_full: {
      type: Array,
      required: true,
      default: () => [],
      validator: (cols) => {
        return cols.every((col) => 'key' in col && 'header' in col);
      },
    },
    name: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      default: 'doctor',
    },

    patient: {
      type: Object,
      default: {},
    },
  },
  emits: ["update:activeIndex", "check-profile", "update:appointment"],
  data() {
    return {
      filterDate: new Date().toISOString().split('T')[0], // Ngày hiện tại (YYYY-MM-DD)
      activeIndex: null, // Thêm activeIndex để lưu index của hàng được chọn
    };
  },
  computed: {
    filteredList() {
      if (this.name !== 'lichhen' || !this.array || !this.array.list) {
        return this.array && this.array.list ? this.array.list : [];
      }
      return this.array.list.filter(row => {
        if (!row.ngaythangnam) return false;
        const rowDate = new Date(row.ngaythangnam).toISOString().split('T')[0];
        const filterDateMinusOne = new Date(this.filterDate);
        filterDateMinusOne.setDate(filterDateMinusOne.getDate() - 1); // Trừ đi 1 ngày
        return rowDate === filterDateMinusOne.toISOString().split('T')[0];
      });
    }
  },
  methods: {
    async check_profile(appointment, role) {
      if (role === 'doctor') {
        try{
          if(!confirm('Bạn có chắc chắn muốn khám bệnh cho bệnh nhân này?')) return;
          appointment = this.formatEditRow(appointment);
          appointment.trangthai = 'DaKham';
          await AppointmentService.update(appointment.mahen, appointment);
          this.$emit('update:appointment')
        }catch (error) {
          console.error("Error updating appointment status:", error);
        }
      } 
      this.$emit('check-profile', appointment.maBN, role);
      // console.log('Checking profile for patient:', maBN);
    },

    isDateField(key, value) {
          return typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value);
        },

    formatEditRow(row) {
      const formattedRow = { ...row };
      Object.keys(formattedRow).forEach((key) => {
        if (this.isDateField(key, formattedRow[key])) {
          const date = new Date(formattedRow[key]);
          if (!isNaN(date)) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedRow[key] = `${year}-${month}-${day}`;
          }
        }
      });
      return formattedRow;
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN');
    },
    updateActiveIndex(index) {
      this.activeIndex = index;
      this.$emit("update:activeIndex", index);
    },
    resetFilterDate() {
      this.filterDate = new Date().toISOString().split('T')[0];
    },
    isToday(date) {
      if (!date) return false;
      const today = new Date().toISOString().split('T')[0];
      const appointmentDate = new Date(date).toISOString().split('T')[0];
      return appointmentDate === today;
    }
  }
};
</script>

<style scoped>
.relative {
  width: 100%;
  max-width: none;
}
table {
  width: 100% !important;
}
th, td {
  padding: 0.75rem;
}
thead tr {
  border-bottom: 2px solid #d1d5db;
}
.dark thead tr {
  border-bottom: 2px solid #6b7280;
}
tbody tr {
  border-bottom: 1.5px solid #e5e7eb;
}
.dark tbody tr {
  border-bottom: 1.5px solid #4b5563;
}
tbody tr:hover {
  background-color: #e5e7eb !important;
  transition: background-color 0.3s ease !important;
}
.dark tbody tr:hover {
  background-color: #4b5563 !important;
}
@media (max-width: 640px) {
  th, td {
    padding: 0.5rem;
  }
}

/* CSS cho bộ lọc ngày */
.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.dark .filter-section {
  background-color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.filter-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.filter-controls label {
  white-space: nowrap;
}
.filter-controls button {
  white-space: nowrap;
}
.date-display {
  font-size: 0.875rem;
  color: #6b7280;
}
.dark .date-display {
  color: #9ca3af;
}
</style>