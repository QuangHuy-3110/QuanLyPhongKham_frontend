```vue
<template>
  <div class="container mt-6">
    <h3 class="mb-4 text-center fw-bold">{{ name }}</h3>
    <!-- Search Section -->
    <div v-if="name.includes('bác sĩ') || name.includes('bệnh nhân') || name.includes('thuốc')" class="mb-5">
      <div class="row g-3">
        <!-- Search for Doctors -->
        <div v-if="name.includes('bác sĩ')" class="col-md-3">
          <input
            v-model="search.maBS"
            type="text"
            class="form-control"
            placeholder="Tìm theo mã bác sĩ"
            @input="searchItems"
          />
        </div>
        <div v-if="name.includes('bác sĩ')" class="col-md-3">
          <input
            v-model="search.tenBS"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên bác sĩ"
            @input="searchItems"
          />
        </div>
        <div v-if="name.includes('bác sĩ')" class="col-md-3">
          <input
            v-model="search.cccdBS"
            type="text"
            class="form-control"
            placeholder="Tìm theo số CCCD bác sĩ"
            @input="searchItems"
          />
        </div>
        <div v-if="name.includes('bác sĩ')" class="col-md-3">
          <input
            v-model="search.maCK"
            type="text"
            class="form-control"
            placeholder="Tìm theo số mã chuyên khoa"
            @input="searchItems"
          />
        </div>
        <!-- Search for Patients -->
        <div v-if="name.includes('bệnh nhân')" class="col-md-4">
          <input
            v-model="search.maBN"
            type="text"
            class="form-control"
            placeholder="Tìm theo mã bệnh nhân"
            @input="searchItems"
          />
        </div>
        <div v-if="name.includes('bệnh nhân')" class="col-md-4">
          <input
            v-model="search.hotenBN"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên bệnh nhân"
            @input="searchItems"
          />
        </div>
        <div v-if="name.includes('bệnh nhân')" class="col-md-4">
          <input
            v-model="search.cccdBN"
            type="text"
            class="form-control"
            placeholder="Tìm theo số CCCD bệnh nhân"
            @input="searchItems"
          />
        </div>
        <!-- Search for Drugs -->
        <div v-if="name.includes('thuốc')" class="col-md-4">
          <input
            v-model="search.maThuoc"
            type="text"
            class="form-control"
            placeholder="Tìm theo mã thuốc"
            @input="searchItems"
          />
        </div>
        <div v-if="name.includes('thuốc')" class="col-md-4">
          <input
            v-model="search.tenthuoc"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên thuốc"
            @input="searchItems"
          />
        </div>
        <div v-if="name.includes('thuốc')" class="col-md-4">
          <input
            v-model="search.maNPP"
            type="text"
            class="form-control"
            placeholder="Tìm theo nhà cung cấp"
            @input="searchItems"
          />
        </div>
      </div>
    </div>

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
            v-for="(row, index) in filteredList"
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
          <tr v-if="!filteredList || filteredList.length === 0">
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
      <div class="modal-dialog modal-xl">
        <div class="modal-content shadow-md sm:rounded-lg">
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
          <div class="modal-body invoice-body">
            <div v-if="selectedRow" class="invoice-container">
              <div class="invoice-header text-center mb-4">
                <h2>{{ isEditing ? 'CHỈNH SỬA THÔNG TIN' : 'THÔNG TIN CHI TIẾT' }}</h2>
                <p class="text-muted">
                  {{ name.includes('bác sĩ') ? `Mã bác sĩ: ${selectedRow.maBS}` : 
                     name.includes('bệnh nhân') ? `Mã bệnh nhân: ${selectedRow.maBN}` : 
                     name.includes('thuốc') ? `Mã thuốc: ${selectedRow.maThuoc}` : 
                     name.includes('lịch hẹn') ? `Mã lịch hẹn: ${selectedRow.mahen}` : 
                     name.includes('nhà cung cấp') ? `Mã nhà cung cấp: ${selectedRow.maNPP}` : '' }}
                </p>
              </div>
              <div class="invoice-info mb-4">
                <div class="row">
                  <div
                    v-for="col in columns_full"
                    :key="col.key"
                    class="col-md-6 mb-2"
                  >
                    <strong>{{ col.header }}: </strong>
                    <template v-if="isEditing">
                      <select
                        v-if="col.key === 'maCK' && name === 'Xem danh sách bác sĩ'"
                        :id="col.key"
                        v-model="editRow[col.key]"
                        class="form-control"
                      >
                        <option value="" disabled>Chọn chuyên khoa</option>
                        <option
                          v-for="specialty in specialties"
                          :key="specialty.maCK"
                          :value="specialty.maCK"
                        >
                          {{ specialty.tenCK }}
                        </option>
                      </select>
                      <input
                        v-else-if="isDateField(col.key, selectedRow[col.key])"
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
                      <span>{{ formatValue(selectedRow[col.key], col.key) }}</span>
                    </template>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end mb-3">
                <button 
                  type="button" 
                  class="btn btn-danger m-2" 
                  v-if="name === 'Danh sách lịch hẹn'"
                  @click="cancel_appointment(selectedRow)"
                >
                  Hủy lịch hẹn
                </button>
                <button 
                  type="button" 
                  class="btn btn-danger m-2"
                  v-if="name !== 'Danh sách lịch hẹn' && name !== 'Xem danh sách bác sĩ đã xóa' && name !== 'Danh sách nhà cung cấp đã xóa' && name !== 'Danh sách bệnh nhân đã xóa' && name !== 'Danh sách thuốc đã xóa' && name !== 'Lịch sử cuộc hẹn đã xóa'"
                  @click="deleteItem(selectedRow)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <button 
                  type="button" 
                  class="btn btn-success m-2"
                  v-if="name === 'Xem danh sách bác sĩ đã xóa' || name === 'Danh sách bệnh nhân đã xóa' || name === 'Danh sách nhà cung cấp đã xóa' || name === 'Danh sách thuốc đã xóa' || name === 'Lịch sử cuộc hẹn đã xóa'"
                  @click="restoreItem(selectedRow)"
                >
                  <i class="fa-solid fa-reply"></i>
                  Khôi phục
                </button>
                <button
                  v-if="name !== 'Danh sách lịch hẹn' && name !== 'Xem danh sách bác sĩ đã xóa' && name !== 'Danh sách nhà cung cấp đã xóa' && name !== 'Danh sách bệnh nhân đã xóa' && name !== 'Danh sách thuốc đã xóa' && name !== 'Lịch sử cuộc hẹn đã xóa'"
                  type="button"
                  class="btn btn-warning m-2"
                  @click="toggleEdit"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
            </div>
            <div v-else class="text-center">Không có dữ liệu để hiển thị</div>
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
import distributorService from '../../services/distributor.service';
import invoiceService from '../../services/invoice.service';
import doctor_roleService from '../../services/doctor_role.service';
import specialtiesService from '../../services/specialties.service';

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
    specialties: {
      type: Array,
      default: () => [],
      validator: (specialties) => {
        return specialties.every((specialty) => 'maCK' in specialty && 'tenCK' in specialty);
      },
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
      search: {
        maBS: '',
        tenBS: '',
        cccdBS: '',
        maBN: '',
        hotenBN: '',
        cccdBN: '',
        maThuoc: '',
        tenthuoc: '',
        maNPP: '',
      },
    };
  },

  computed: {
    filteredList() {
      if (!this.array || !this.array.list) return [];

      return this.array.list.filter((item) => {
        const searchMaBS = this.search.maBS ? this.search.maBS.toLowerCase() : '';
        const searchTenBS = this.search.tenBS ? this.search.tenBS.toLowerCase() : '';
        const searchCccdBS = this.search.cccdBS ? this.search.cccdBS.toLowerCase() : '';
        const searchmaCK = this.search.maCK ? this.search.maCK.toLowerCase() : '';
        const searchMaBN = this.search.maBN ? this.search.maBN.toLowerCase() : '';
        const searchHotenBN = this.search.hotenBN ? this.search.hotenBN.toLowerCase() : '';
        const searchCccdBN = this.search.cccdBN ? this.search.cccdBN.toLowerCase() : '';
        const searchMaThuoc = this.search.maThuoc ? this.search.maThuoc.toLowerCase() : '';
        const searchTenthuoc = this.search.tenthuoc ? this.search.tenthuoc.toLowerCase() : '';
        const searchNhaCungCap = this.search.maNPP ? this.search.maNPP.toLowerCase() : '';

        if (this.name.includes('bác sĩ')) {
          return (
            (!searchMaBS || (item.maBS && item.maBS.toLowerCase().includes(searchMaBS))) &&
            (!searchTenBS || (item.tenBS && item.tenBS.toLowerCase().includes(searchTenBS))) &&
            (!searchCccdBS || (item.cccdBS && item.cccdBS.toLowerCase().includes(searchCccdBS))) &&
            (!searchmaCK || (item.maCK && item.maCK.toLowerCase().includes(searchmaCK)))
          );
        } else if (this.name.includes('bệnh nhân')) {
          return (
            (!searchMaBN || (item.maBN && item.maBN.toLowerCase().includes(searchMaBN))) &&
            (!searchHotenBN || (item.hotenBN && item.hotenBN.toLowerCase().includes(searchHotenBN))) &&
            (!searchCccdBN || (item.cccdBN && item.cccdBN.toLowerCase().includes(searchCccdBN)))
          );
        } else if (this.name.includes('thuốc')) {
          return (
            (!searchMaThuoc || (item.maThuoc && item.maThuoc.toLowerCase().includes(searchMaThuoc))) &&
            (!searchTenthuoc || (item.tenthuoc && item.tenthuoc.toLowerCase().includes(searchTenthuoc))) &&
            (!searchNhaCungCap || (item.maNPP && item.maNPP.toLowerCase().includes(searchNhaCungCap)))
          );
        }
        return true;
      });
    },
  },

  watch: {
    'array.list': {
      handler(newValue) {
        if (newValue) {
          // Đặt lại selectedRow, editRow và isEditing khi array.list thay đổi
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
    async restoreItem(item) {
      try {
        if (!confirm('Bạn có chắc muốn khôi phục mục này?')) return;

        if (this.name === 'Xem danh sách bác sĩ đã xóa') {
          item = this.formatEditRow(item); // Định dạng lại item trước khi gửi
          item.xoa = 0; // Đánh dấu là chưa xóa
          await doctorService.update(item.maBS, item);
          this.$emit('update:array');
          alert('Khôi phục bác sĩ thành công!');
        } else if (this.name === 'Danh sách bệnh nhân đã xóa') {
          item = this.formatEditRow(item); // Định dạng lại item trước khi gửi
          item.xoa = 0; // Đánh dấu là chưa xóa
          await patientService.update(item.maBN, item);
          this.$emit('update:array');
          alert('Khôi phục bệnh nhân thành công!');

          this.wsService.send({
            type: 'interact_patient',
            sender: 'Admin',
            data: item,
          });
        } else if (this.name === 'Danh sách nhà cung cấp đã xóa') {
          item = this.formatEditRow(item); // Định dạng lại item trước khi gửi
          item.xoa = 0; // Đánh dấu là chưa xóa
          await distributorService.update(item.maNPP, item);
          this.$emit('update:array');
          alert('Khôi phục nhà cung cấp thành công!');
        } else if (this.name === 'Danh sách thuốc đã xóa') {
          item.xoa = 0; // Đánh dấu là chưa xóa
          await drugService.update(item.maThuoc, item);
          this.$emit('update:array');
          alert('Khôi phục thuốc thành công!');

          this.wsService.send({
            type: 'interact_drug',
            sender: 'Admin',
            data: item,
          });
        } 
        // Đóng modal và reset trạng thái
        this.selectedRow = null;
        this.editRow = null;
        this.isEditing = false;
      } catch (error) {
        console.error('Khôi phục không thành công:', error);
        alert('Khôi phục không thành công!');
      }
    },

    async cancel_appointment(appointment) {
      try {
        appointment.trangthai = "Huy";
        appointment = this.formatEditRow(appointment);
        await appointmentService.update(appointment.mahen, appointment);
        this.$emit('update:appointment_new', { obj: appointment, name: this.name });

        this.wsService.send({
          type: 'cancel_appointment',
          sender: 'Admin',
          data: appointment,
        });

        alert("Hủy lịch hẹn thành công!");

        // Đóng modal và reset trạng thái
        this.selectedRow = null;
        this.editRow = null;
        this.isEditing = false;
      } catch (error) {
        console.log("Hủy lịch hẹn không thành công: ", error);
        alert("Hủy lịch hẹn không thành công!");
      }
    },

    async deleteItem(item) {
      try {
        if (!confirm('Bạn có chắc muốn xóa mục này?')) return;

        if (this.name === 'Xem danh sách bác sĩ') {
          if (item.maBS === 'admin') {
            alert('Không thể xóa bác sĩ admin!');
            return;
          }
          item = this.formatEditRow(item); // Định dạng lại item trước khi gửi
          item.xoa = 1; // Đánh dấu là đã xóa
          await doctorService.update(item.maBS, item);
          this.$emit('update:array');
          alert('Xóa thành công!');
        } else if (this.name === 'Danh sách bệnh nhân') {
          item = this.formatEditRow(item); // Định dạng lại item trước khi gửi
          item.xoa = 1; // Đánh dấu là đã xóa
          await patientService.update(item.maBN, item);
          this.$emit('update:array');
          alert('Xóa thành công!');

          this.wsService.send({
            type: 'interact_patient',
            sender: 'Admin',
            data: item,
          });
        } else if (this.name === 'Danh sách nhà cung cấp') {
          item = this.formatEditRow(item); // Định dạng lại item trước khi gửi
          item.xoa = 1; // Đánh dấu là đã xóa
          await distributorService.update(item.maNPP, item);
          this.$emit('update:array');
          alert('Xóa thành công!');
        } else if (this.name === 'Danh sách thuốc' || this.name === 'Danh sách thuốc gần hết') {
          item.xoa = 1; // Đánh dấu là đã xóa
          await drugService.update(item.maThuoc, item);
          this.$emit('update:array');
          alert('Xóa thành công!');

          this.wsService.send({
            type: 'interact_drug',
            sender: 'Admin',
            data: item,
          });
        } else if (this.name === 'Lịch sử cuộc hẹn') {
          await appointmentService.delete(item.mahen);
          this.$emit('update:array');
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
      this.selectedRow = this.filteredList[index];
      // Tạo bản sao để chỉnh sửa với định dạng ngày
      this.editRow = this.formatEditRow(this.filteredList[index]);
      this.isEditing = false;
      this.showModal = true;
      this.$emit('update:activeIndex', index);
    },

    toggleEdit() {
      this.isEditing = !this.isEditing;
    },

    async saveChanges() {
      try {
        // Chuyển đổi editRow cho backend (giữ định dạng ngày YYYY-MM-DD)
        const saveRow = this.parseEditRow(this.editRow);
        if (this.name === 'Xem danh sách bác sĩ') {
          // Lưu chuyên môn cũ
          const oldSpecialty = {
            maBS: this.selectedRow.maBS,
            maCK: this.selectedRow.maCK,
          };
          // Lưu chuyên môn mới
          const newSpecialty = {
            maBS: saveRow.maBS,
            maCK: saveRow.maCK,
          };
          // In ra console
          // console.log('Chuyên môn cũ:', oldSpecialty);
          // console.log('Chuyên môn mới:', newSpecialty);
          await doctor_roleService.update(oldSpecialty.maBS, oldSpecialty.maCK, newSpecialty)
          const { maCK, ...updatedRow } = saveRow;
          // console.log('BS moi:', updatedRow);
          await doctorService.update(updatedRow.maBS, updatedRow);
          alert("Cập nhật thành công!");

        } else if (this.name === 'Danh sách bệnh nhân') {
          await patientService.update(saveRow.maBN, saveRow);
          alert("Cập nhật thành công!");
          this.wsService.send({
            type: 'interact_patient',
            sender: 'Admin',
            data: saveRow,
          }); // Gửi thông báo qua WebSocket
        } else if (this.name === 'Danh sách thuốc' || this.name === 'Danh sách thuốc gần hết') {
          await drugService.update(saveRow.maThuoc, saveRow);
          alert("Cập nhật thành công!");
          this.wsService.send({
            type: 'interact_drug',
            sender: 'Admin',
            data: saveRow,
          }); // Gửi thông báo qua WebSocket
        } else if (this.name === 'Danh sách chuyên khoa'){
          await specialtiesService.update(saveRow.maCK, saveRow)
          alert("Cập nhật thành công!");
        }

        // Cập nhật mảng cục bộ với định dạng backend
        if (this.selectedIndex !== null) {
          this.array.list[this.selectedIndex] = { ...saveRow }; // Gán trực tiếp cho Vue 3
          this.selectedRow = { ...saveRow }; // Cập nhật hàng hiển thị
          this.editRow = this.formatEditRow(saveRow); // Cập nhật editRow với định dạng ngày
        }
        this.isEditing = false;
      } catch (error) {
        console.error("Cập nhật lỗi: ", error);
        alert("Cập nhật lỗi!");
      }
    },

    cancelEdit() {
      this.editRow = this.selectedRow ? this.formatEditRow(this.selectedRow) : null; // Reset editRow với định dạng ngày
      this.isEditing = false;
    },

    formatValue(value, key) {
      if (!value) return 'N/A';
      // Kiểm tra nếu giá trị là chuỗi ngày ISO hoặc YYYY-MM-DD
      if (typeof value === 'string' && (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value) || /\d{4}-\d{2}-\d{2}/.test(value))) {
        const date = new Date(value);
        if (!isNaN(date)) {
          // Định dạng thành DD/MM/YYYY
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      }
      return value; // Trả về giá trị gốc nếu không phải ngày
    },

    isDateField(key, value) {
      // Kiểm tra xem trường có phải là trường ngày dựa trên giá trị
      return typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value);
    },

    formatEditRow(row) {
      // Tạo bản sao của hàng với ngày được định dạng để hiển thị
      const formattedRow = { ...row };
      Object.keys(formattedRow).forEach((key) => {
        if (this.isDateField(key, formattedRow[key])) {
          const date = new Date(formattedRow[key]);
          if (!isNaN(date)) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedRow[key] = `${year}-${month}-${day}`; // Định dạng cho input type="date"
          }
        }
      });
      return formattedRow;
    },

    parseEditRow(row) {
      // Tạo bản sao của hàng, giữ ngày ở định dạng YYYY-MM-DD và chuyển các trường khác không thay đổi
      const parsedRow = { ...row };
      Object.keys(parsedRow).forEach((key) => {
        if (typeof parsedRow[key] === 'string' && /\d{4}-\d{2}-\d{2}/.test(parsedRow[key])) {
          const date = new Date(`${parsedRow[key]}T00:00:00.000Z`);
          if (!isNaN(date)) {
            parsedRow[key] = parsedRow[key]; // Giữ nguyên định dạng YYYY-MM-DD cho backend
          }
        }
      });
      return parsedRow;
    },

    searchItems() {
      // Trigger computed property to filter the list
      this.$forceUpdate(); // Force update to ensure reactivity
    },
  },

  mounted() {
    this.wsService.connect();
  },

  beforeDestroy() {
    this.wsService.disconnect(); // Đóng WebSocket khi component bị hủy
  },
};
</script>

<style scoped>
@import "@/assets/editform.css";
</style>
```