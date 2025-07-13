<template>
  <div class="container mt-6">
    <h3 class="mb-4 text-center fw-bold">{{ name }}</h3>
    <!-- Bảng -->
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
            v-for="(row, index) in array && array.list ? array.list : []"
            :key="index"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-600 cursor-pointer"
            @click="openModal(index)"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-4">
              {{ formatValue(row[col.key], col.key) }}
            </td>
          </tr>
          <tr v-if="!array || !array.list || array.list.length === 0">
            <td :colspan="columns.length" class="px-4 py-4 text-center">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gray-700 text-gray-100">
            <h5 class="modal-title" id="exampleModalLabel">{{ isEditing ? 'Chỉnh Sửa Thông Tin' : 'Chi Tiết Thông Tin' }}</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="cancelEdit"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedRow" class="row">
              <div
                v-for="col in columns_full"
                :key="col.key"
                class="col-md-6 mb-3"
              >
                <label :for="col.key" class="form-label">
                  <strong>{{ col.header }}: &nbsp;</strong>
                </label>
                <template v-if="isEditing">
                  <input
                    v-if="isDateField(col.key, selectedRow[col.key])"
                    :id="col.key"
                    v-model="editRow[col.key]"
                    type="date"
                    class="form-control"
                    :disabled="col.key.startsWith('ma')"
                  />
                  <input
                    v-else
                    :id="col.key"
                    v-model="editRow[col.key]"
                    type="text"
                    class="form-control"
                    :placeholder="col.header"
                    :disabled="col.key.startsWith('ma')"
                  />
                </template>
                <template v-else>
                  {{ formatValue(selectedRow[col.key], col.key) }}
                </template>
              </div>
            </div>
            <div v-else class="text-center">Không có dữ liệu để hiển thị</div>
            <div class="d-flex justify-content-end mb-3">
              <button type="button" class="btn btn-danger m-2" 
              v-if="name === 'Danh sách lịch hẹn'"
              @click="cancel_appointment(selectedRow)">
                Hủy lịch hẹn
              </button>

              <button type="button" class="btn btn-danger m-2"
              v-if="name !== 'Danh sách lịch hẹn'"
              @click="deleteItem(selectedRow)">
                <i class="fa-solid fa-trash"></i>
              </button>

              <button
                v-if="name !== 'Danh sách lịch hẹn'"
                type="button"
                class="btn btn-warning m-2"
                @click="toggleEdit"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              v-if="isEditing"
              type="button"
              class="btn btn-primary me-2"
              @click="saveChanges"
            >
              Lưu
            </button>
            <button
              v-if="isEditing"
              type="button"
              class="btn btn-secondary me-2"
              @click="cancelEdit"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="cancelEdit"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import doctorService from '../../services/doctor.service';
import patientService from '../../services/patient.service';
import drugService from '../../services/drug.service';
import appointmentService from '../../services/appointment.service';
import WebSocketService from '@/services/ws.service';

export default {
  props: {
    array: {
      type: Object,
      validator: (data) => {
        return 'list' in data && Array.isArray(data.list);
      },
    },
    columns: {
      type: Array,
      default: () => [],
      validator: (cols) => {
        return cols.every((col) => 'key' in col && 'header' in col);
      },
    },
    columns_full: {
      type: Array,
      default: () => [],
      validator: (cols) => {
        return cols.every((col) => 'key' in col && 'header' in col);
      },
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
  },
  emits: ['update:activeIndex', 'update:appointment_new', 'update:array'],
  data() {
    return {
      wsService: new WebSocketService(),
      showModal: false,
      selectedRow: null,
      selectedIndex: null,
      isEditing: false,
      editRow: null,
    };
  },
  methods: {

    async cancel_appointment(appointment){
      try {
        appointment.trangthai = "Huy"
        appointment = this.formatEditRow(appointment)
        console.log(appointment)
        await appointmentService.update(appointment.mahen, appointment )
        this.$emit('update:appointment_new', {obj: appointment, name:this.name })

        this.wsService.send({
          type: 'cancel_appointment',
          sender: 'Admin',
          data: appointment,
        });

        alert("Hủy lịch hẹn thành công!")

        // Đóng modal và reset trạng thái
        this.selectedRow = null;
        this.editRow = null;
        this.isEditing = false;
      }catch (error){
        console.log("Hủy lịch hẹn không thành công: ", error)
        alert("Hủy lịch hẹn không thành công!")
      }
    },

    async deleteItem(item) {
      try {
        if (!confirm('Bạn có chắc muốn xóa mục này?')) return;

        if (this.name === 'Xem danh sách bác sĩ') {
          await doctorService.delete(item.maBS);
          this.$emit('update:array', {obj: item, name:this.name })
          alert('Xóa thành công!');
        } else if (this.name === 'Danh sách bệnh nhân') {
          await patientService.delete(item.maBN);
          this.$emit('update:array', {obj: item, name:this.name })
          alert('Xóa thành công!');
        } else if (this.name === 'Danh sách thuốc' || this.name === 'Danh sách thuốc gần hết') {
          await drugService.delete(item.maThuoc);
          this.$emit('update:array', {obj: item, name:this.name })
          alert('Xóa thành công!');
        }else if (this.name === 'Lịch sử cuộc hẹn') {
          await appointmentService.delete(item.mahen);
          this.$emit('update:array', {obj: item, name:this.name })
          alert('Xóa thành công!');
        }

        // Đóng modal và reset trạng thái
        this.selectedRow = null;
        this.editRow = null;
        this.isEditing = false;

      } catch (error) {
        console.error('Xóa không thành công:', error);
        alert('Xóa không thành công!');
      }
    },

    openModal(index) {
      this.selectedIndex = index;
      this.selectedRow = this.array.list[index];
      // Create a copy for editing with formatted dates
      this.editRow = this.formatEditRow(this.array.list[index]);
      this.isEditing = false;
      this.showModal = true;
      this.$emit('update:activeIndex', index);
    },
    
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },

    async saveChanges() {
      try {
        // Convert editRow for backend (keep dates as YYYY-MM-DD)
        const saveRow = this.parseEditRow(this.editRow);
        if(this.name === 'Xem danh sách bác sĩ'){
          console.log('Sending to backend:', saveRow); // Debug log
          await doctorService.update(saveRow.maBS, saveRow);
          console.log("Cập nhật thành công!");
          alert("Cập nhật thành công!")
        }

        if(this.name === 'Danh sách bệnh nhân'){
          console.log('Sending to backend:', saveRow); // Debug log
          await patientService.update(saveRow.maBN, saveRow);
          console.log("Cập nhật thành công!");
          alert("Cập nhật thành công!")
        }

        if(this.name === 'Danh sách thuốc' || this.name === 'Danh sách thuốc gần hết'){
          console.log('Sending to backend:', saveRow); // Debug log
          await drugService.update(saveRow.maThuoc, saveRow);
          console.log("Cập nhật thành công!");
          alert("Cập nhật thành công!")
        }
        
        // Update local array with backend format

        if (this.selectedIndex !== null) {
          this.array.list[this.selectedIndex] = { ...saveRow }; // Direct assignment for Vue 3
          this.selectedRow = { ...saveRow }; // Update displayed row
          this.editRow = this.formatEditRow(saveRow); // Update editRow with formatted dates
        }
        this.isEditing = false;
      } catch (error) {
        alert.error('Cập nhật lỗi!')
        console.error("Cập nhật lỗi: ", error);
        throw error; // Rethrow for parent handling if needed
      }
    },

    cancelEdit() {
      this.editRow = this.selectedRow ? this.formatEditRow(this.selectedRow) : null; // Reset editRow with formatted dates
      this.isEditing = false;
    },

    formatValue(value, key) {
      if (!value) return 'N/A';
      // Check if the value is a valid ISO date string or YYYY-MM-DD
      if (typeof value === 'string' && (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value) || /\d{4}-\d{2}-\d{2}/.test(value))) {
        const date = new Date(value);
        if (!isNaN(date)) {
          // Format as DD/MM/YYYY
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      }
      return value; // Return original value if not a date
    },

    isDateField(key, value) {
      // Check if the field is a date field based on value
      return typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value);
    },

    formatEditRow(row) {
      // Create a copy of the row with formatted dates for display
      const formattedRow = { ...row };
      Object.keys(formattedRow).forEach((key) => {
        if (this.isDateField(key, formattedRow[key])) {
          const date = new Date(formattedRow[key]);
          if (!isNaN(date)) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedRow[key] = `${year}-${month}-${day}`; // Format for input type="date"
          }
        }
      });
      return formattedRow;
    },

    parseEditRow(row) {
      // Create a copy of the row, keeping dates as YYYY-MM-DD and passing other fields unchanged
      const parsedRow = { ...row };
      Object.keys(parsedRow).forEach((key) => {
        if (typeof parsedRow[key] === 'string' && /\d{4}-\d{2}-\d{2}/.test(parsedRow[key])) {
          const date = new Date(`${parsedRow[key]}T00:00:00.000Z`);
          if (!isNaN(date)) {
            parsedRow[key] = parsedRow[key]; // Keep as YYYY-MM-DD for backend
          }
        }
      });
      return parsedRow;
    },
  },

  mounted(){
    this.wsService.connect();
    // this.wsService.onMessage((message) => {
    //   if (message.type === 'response') {
    //     this.message = message.data;
    //   }
    // });
  }
};
</script>

<style scoped>
@import "@/assets/editform.css";
</style>
