<template>
  <div class="container mt-6">
    <h3 class="mb-4 text-center fw-bold">{{ name }}</h3>

    <!-- Form tìm kiếm -->
    <div class="mb-4">
      <form @submit.prevent="applySearch" class="row g-3">
        <div class="col-md-4">
          <label for="searchDate" class="form-label">Ngày Lập Hồ Sơ</label>
          <input
            id="searchDate"
            v-model="search.date"
            type="date"
            class="form-control"
            placeholder="Chọn ngày"
            @change="applySearch"
          />
        </div>
        <div class="col-md-4">
          <label for="searchMaBN" class="form-label">Mã Bệnh Nhân</label>
          <input
            id="searchMaBN"
            v-model="search.maBN"
            type="text"
            class="form-control"
            placeholder="Nhập mã bệnh nhân"
          />
        </div>
        <div class="col-md-4">
          <label for="searchMaHS" class="form-label">Mã Hồ Sơ</label>
          <input
            id="searchMaHS"
            v-model="search.maHS"
            type="text"
            class="form-control"
            placeholder="Nhập mã hồ sơ"
          />
        </div>
        <div class="col-12 d-flex justify-content-end mt-2">
          <button type="submit" class="btn btn-primary me-2">Tìm kiếm</button>
          <button type="button" class="btn btn-secondary" @click="resetSearch">Reset</button>
        </div>
      </form>
    </div>

    <!-- Bảng -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-100 uppercase bg-gray-700 dark:bg-gray-900 dark:text-gray-200 bg-secondary-subtle">
          <tr>
            <th v-for="col in columns" :key="col.key" scope="col" class="px-4 py-3 min-w-[100px]">
              {{ col.header }}
            </th>
            <!-- <th scope="col" class="px-4 py-3 w-[80px] text-center"></th> -->
          </tr>
        </thead>
        <tbody id="tbody">
          <tr
            v-for="(row, index) in filteredList"
            :key="index"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-600 cursor-pointer"
            @click="openModal(index)"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-4">
              {{ formatValue(row[col.key], col.key) }}
            </td>
            <!-- <td class="px-4 py-4 text-center">
              <button
                type="button"
                class="btn btn-danger btn-sm"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Xóa"
                @click.stop="deleteRow(index)"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </td> -->
          </tr>
          <tr v-if="!filteredList || filteredList.length === 0">
            <td :colspan="columns.length + 1" class="px-4 py-4 text-center">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
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
  emits: ['update:activeIndex'],
  data() {
    return {
      showModal: false,
      selectedRow: null,
      selectedIndex: null,
      isEditing: false,
      editRow: null,
      search: {
        date: '',
        maBN: '',
        maHS: '',
      },
    };
  },
  computed: {
    filteredList() {
      if (!this.array || !this.array.list) return [];
      let filtered = [...this.array.list];

      // Lọc theo ngày lập hồ sơ
      if (this.search.date) {
        filtered = filtered.filter((row) => {
          const dateField = row.ngaylapHS;
          if (dateField && typeof dateField === 'string') {
            let rowDate;
            let date;
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(dateField)) {
              // ISO string: 2025-07-11T00:00:00.000Z
              date = new Date(dateField);
            } else if (/\d{4}-\d{2}-\d{2}/.test(dateField)) {
              // YYYY-MM-DD
              date = new Date(`${dateField}T00:00:00.000+07:00`); // Sử dụng múi giờ +07
            } else if (/\d{2}\/\d{2}\/\d{4}/.test(dateField)) {
              // DD/MM/YYYY
              const [day, month, year] = dateField.split('/');
              date = new Date(`${year}-${month}-${day}T00:00:00.000+07:00`);
            } else {
              return false;
            }
            if (!isNaN(date)) {
              // Chuẩn hóa thành YYYY-MM-DD theo múi giờ cục bộ (+07)
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              rowDate = `${year}-${month}-${day}`;
              console.log('Row date:', rowDate, 'Search date:', this.search.date); // Debug
              return rowDate === this.search.date;
            }
            return false;
          }
          return false;
        });
      }

      // Lọc theo mã bệnh nhân
      if (this.search.maBN) {
        filtered = filtered.filter((row) =>
          row.maBN?.toLowerCase().includes(this.search.maBN.toLowerCase())
        );
      }

      // Lọc theo mã hồ sơ
      if (this.search.maHS) {
        filtered = filtered.filter((row) =>
          row.maHS?.toLowerCase().includes(this.search.maHS.toLowerCase())
        );
      }

      return filtered;
    },
  },
  methods: {
    openModal(index) {
      this.selectedIndex = index;
      this.selectedRow = this.array.list[index];
      this.editRow = this.formatEditRow(this.array.list[index]);
      this.isEditing = false;
      this.showModal = true;
      this.$emit('update:activeIndex', index);
    },

    toggleEdit() {
      this.isEditing = !this.isEditing;
    },

    applySearch() {
      // Không cần làm gì thêm vì filteredList tự động cập nhật nhờ computed property
    },

    resetSearch() {
      this.search.date = '';
      this.search.maBN = '';
      this.search.maHS = '';
    },

    formatValue(value, key) {
      if (!value) return 'N/A';
      if (
        typeof value === 'string' &&
        (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(value) || /\d{4}-\d{2}-\d{2}/.test(value))
      ) {
        const date = new Date(value);
        if (!isNaN(date)) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      }
      return value;
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

    parseEditRow(row) {
      const parsedRow = { ...row };
      Object.keys(parsedRow).forEach((key) => {
        if (typeof parsedRow[key] === 'string' && /\d{4}-\d{2}-\d{2}/.test(parsedRow[key])) {
          const date = new Date(`${parsedRow[key]}T00:00:00.000+07:00`);
          if (!isNaN(date)) {
            parsedRow[key] = parsedRow[key];
          }
        }
      });
      return parsedRow;
    },
  },
};
</script>

<style scoped>
@import "@/assets/editform.css";

</style>