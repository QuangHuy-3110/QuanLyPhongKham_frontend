<template>
  <div class="container mt-6">
    <h3 class="mb-4 text-center fw-bold">{{ name }}</h3>
    <!-- Phần tìm kiếm -->
    <div v-if="name.includes('hóa đơn')" class="mb-5">
      <div class="row g-3">
        <div class="col-md-4">
          <input
            v-model="search.maHD"
            type="text"
            class="form-control"
            placeholder="Tìm theo mã hóa đơn"
            @input="searchItems"
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="search.maNPP"
            type="text"
            class="form-control"
            placeholder="Tìm theo mã nhà phân phối"
            @input="searchItems"
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="search.ngayNhap"
            type="date"
            class="form-control"
            placeholder="Tìm theo ngày nhập"
            @input="searchItems"
          />
        </div>
      </div>
    </div>

    <!-- Bảng danh sách hóa đơn -->
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
            data-bs-target="#invoiceModal"
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

    <!-- Modal chi tiết hóa đơn -->
    <div
      class="modal fade"
      id="invoiceModal"
      tabindex="-1"
      aria-labelledby="invoiceModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gray-700 text-gray-100">
            <h5 class="modal-title" id="invoiceModalLabel">Chi Tiết Hóa Đơn</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body invoice-body">
            <div v-if="selectedRow" class="invoice-container">
              <!-- Tiêu đề hóa đơn -->
              <div class="invoice-header text-center mb-4">
                <h2 v-if="name === 'Danh sách hóa đơn'">HÓA ĐƠN NHẬP HÀNG</h2>
                <h2 v-if="name === 'Xem nhật kí đặt thuốc'">CHI TIẾT LẦN ĐẶT HÀNG</h2>
                <p class="text-muted" v-if="name === 'Danh sách hóa đơn'">Mã hóa đơn: {{ selectedRow.maHD }}</p>
                <p class="text-muted" v-if="name === 'Xem nhật kí đặt thuốc'">Mã lần đặt: {{ selectedRow.maNK }}</p>
              </div>
              <!-- Thông tin hóa đơn -->
              <div class="invoice-info mb-4">
                <div class="row">
                  <div v-for="col in columns" :key="col.key" class="col-md-6 mb-2">
                    <strong>{{ col.header }}: </strong>
                    <span>{{ formatValue(selectedRow[col.key], col.key) }}</span>
                  </div>
                </div>
              </div>
              <!-- Bảng chi tiết hóa đơn -->
              <h5 class="fw-bold mb-3">Chi Tiết Hóa Đơn</h5>
              <div class="table-responsive">
                <table class="table table-bordered table-striped">
                  <thead class="table-gray">
                    <tr>
                      <th v-for="col in chiTietColumns" :key="col.key" class="px-4 py-2">
                        {{ col.header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(chiTiet, index) in selectedChiTiet" :key="index">
                      <td v-for="col in chiTietColumns" :key="col.key" class="px-4 py-2">
                        {{ formatValue(chiTiet[col.key], col.key) }}
                      </td>
                    </tr>
                    <tr v-if="!selectedChiTiet || selectedChiTiet.length === 0">
                      <td :colspan="chiTietColumns.length" class="text-center">Không có chi tiết hóa đơn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- Tổng tiền -->
              <div class="invoice-footer text-end mt-4">
                <h5 v-if="name === 'Danh sách hóa đơn'"><strong>Tổng tiền: </strong>{{ formatValue(selectedRow.tongtien, 'tongtien') }} VND</h5>
              </div>
            </div>
            <div v-else class="text-center">Không có dữ liệu để hiển thị</div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="closeModal"
            >
              Đóng
            </button>

            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="delete_invoice"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import invoice_detailsService from '../../services/invoice_details.service';
import invoiceService from '../../services/invoice.service';
import logService from '../../services/log.service';
import log_detailsService from '../../services/log_details.service';

export default {
  props: {
    array: {
      type: Object,
      validator: (data) => {
        return 'list' in data && Array.isArray(data.list);
      },
      required: true,
    },

    columns: {
      type: Array,
      default: () => [],
      validator: (cols) => {
        return cols.every((col) => 'key' in col && 'header' in col);
      },
      required: true,
    },

    chiTietArray: {
      type: Object,
      validator: (data) => {
        return 'list' in data && Array.isArray(data.list);
      },
      required: true,
    },

    chiTietColumns: {
      type: Array,
      default: () => [],
      validator: (cols) => {
        return cols.every((col) => 'key' in col && 'header' in col);
      },
      required: true,
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
      selectedRow: null,
      selectedIndex: null,
      selectedChiTiet: [],
      search: {
        maHD: '',
        maNPP: '',
        ngayNhap: '',
      },
    };
  },

  computed: {
    filteredList() {
      if (!this.array || !this.array.list) return [];

      return this.array.list.filter((item) => {
        const searchMaHD = this.search.maHD ? this.search.maHD.toLowerCase() : '';
        const searchMaNPP = this.search.maNPP ? this.search.maNPP.toLowerCase() : '';
        const searchNgayNhap = this.search.ngayNhap ? this.search.ngayNhap : '';

        // Chuẩn hóa ngày để so sánh
        const normalizeDate = (dateStr) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          if (isNaN(date)) return '';
          // Chỉ lấy năm, tháng, ngày để tránh ảnh hưởng múi giờ
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };

        const itemDate = normalizeDate(item.ngaynhap);
        const searchDate = normalizeDate(searchNgayNhap);

        return (
          (!searchMaHD || (item.maHD && item.maHD.toLowerCase().includes(searchMaHD))) &&
          (!searchMaNPP || (item.maNPP && item.maNPP.toLowerCase().includes(searchMaNPP))) &&
          (!searchNgayNhap || (itemDate && itemDate === searchDate))
        );
      });
    },
  },
  watch: {
    'array.list': {
      handler(newValue) {
        if (newValue) {
          this.selectedRow = null;
          this.selectedIndex = null;
          this.selectedChiTiet = [];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async delete_invoice() {

      if (!this.selectedRow) {
        alert('Không có hóa đơn được chọn để xóa!');
        return;
      }

      if (!confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
        return;
      }

      try {
        // Xóa các chi tiết hóa đơn trước
        if(this.name === 'Danh sách hóa đơn'){
          for (const detail of this.selectedChiTiet) {
            await invoice_detailsService.delete(detail.maHD, detail.maThuoc);
          }
          // Xóa hóa đơn
          await invoiceService.delete(this.selectedRow.maHD);
        }

        else if(this.name === 'Xem nhật kí đặt thuốc'){
          for (const detail of this.selectedChiTiet) {
            await log_detailsService.delete(detail.maNK, detail.maThuoc);
          }
          // Xóa nhật kí
          await logService.delete(this.selectedRow.maNK)
        }

        alert('Xóa hóa đơn thành công!');
        this.$emit('invoiceDeleted');
        this.closeModal();
        this.searchItems();
      } catch (error) {
        // alert(`Lỗi khi xóa hóa đơn: ${error.message}`);
        // console.error('Lỗi khi xóa hóa đơn:', error);
        const errorMessage = error.response?.data?.message || 'Xóa hóa đơn thất bại!';
        alert(errorMessage);
      }
    },

    openModal(index) {
      this.selectedIndex = index;
      this.selectedRow = this.filteredList[index];
      if(this.name === 'Danh sách hóa đơn'){
        this.selectedChiTiet = this.chiTietArray.list.filter(
          (chiTiet) => chiTiet.maHD === this.selectedRow.maHD
        );
      }else if (this.name === 'Xem nhật kí đặt thuốc'){
        this.selectedChiTiet = this.chiTietArray.list.filter(
          (chiTiet) => chiTiet.maNK === this.selectedRow.maNK
        );
      }
      
      this.$emit('update:activeIndex', index);
    },

    closeModal() {
      this.selectedRow = null;
      this.selectedIndex = null;
      this.selectedChiTiet = [];
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
      if (key === 'tongtien' || key === 'thanhtien' || key === 'dongia') {
        return Number(value).toLocaleString('vi-VN');
      }
      return value;
    },
    
    searchItems() {
      this.$forceUpdate();
    },
  },
};
</script>
<style scoped>

  @import "@/assets/tableInvoice.css";

</style>