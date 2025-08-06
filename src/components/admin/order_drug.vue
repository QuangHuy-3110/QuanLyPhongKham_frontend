<template>
  <div class="container mt-6">
    <h3 class="mb-4 text-center fw-bold">{{ name }}</h3>
    <!-- Phần tìm kiếm và nút đặt hàng -->
    <div class="mb-5">
      <div class="row g-3 align-items-center">
        <div class="col-md-3">
          <input
            v-model="search.maThuoc"
            type="text"
            class="form-control"
            placeholder="Tìm theo mã thuốc"
            @input="searchItems"
          />
        </div>
        <div class="col-md-3">
          <input
            v-model="search.tenThuoc"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên thuốc"
            @input="searchItems"
          />
        </div>
        <div class="col-md-3">
          <select
            v-model="search.maNPP"
            class="form-control"
            @change="searchItems"
          >
            <option value="">Tất cả nhà phân phối</option>
            <option v-for="npp in distributors.list" :key="npp.maNPP" :value="npp.maNPP">
              {{ npp.maNPP }} - {{ npp.tenNPP }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <button
            type="button"
            class="btn btn-primary w-100"
            data-bs-toggle="modal"
            data-bs-target="#orderModal"
            @click="openOrderModal"
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách thuốc gần hết -->
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
            @click="openMedicineModal(index)"
            data-bs-toggle="modal"
            data-bs-target="#medicineModal"
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

    <!-- Modal chi tiết thuốc -->
    <div
      class="modal fade"
      id="medicineModal"
      tabindex="-1"
      aria-labelledby="medicineModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gray-700 text-gray-100">
            <h5 class="modal-title" id="medicineModalLabel">Chi Tiết Thuốc</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeMedicineModal"
            ></button>
          </div>
          <div class="modal-body invoice-body">
            <div v-if="selectedMedicine" class="invoice-container">
              <div class="invoice-header text-center mb-4">
                <h2>THÔNG TIN THUỐC</h2>
                <p class="text-muted">Mã thuốc: {{ selectedMedicine.maThuoc }}</p>
              </div>
              <div class="invoice-info mb-4">
                <div class="row">
                  <div v-for="col in columns" :key="col.key" class="col-md-6 mb-2">
                    <strong>{{ col.header }}: </strong>
                    <span>{{ formatValue(selectedMedicine[col.key], col.key) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center">Không có dữ liệu để hiển thị</div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="closeMedicineModal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal đặt hàng -->
    <div
      class="modal fade"
      id="orderModal"
      tabindex="-1"
      aria-labelledby="orderModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gray-700 text-gray-100">
            <h5 class="modal-title" id="orderModalLabel">Đặt Hàng</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeOrderModal"
            ></button>
          </div>
          <div class="modal-body invoice-body">
            <div class="mb-4">
              <label class="form-label">Chọn nhà phân phối:</label>
              <select
                v-model="selectedNPP"
                class="form-control"
                @change="updateOrderList"
              >
                <option value="">Chọn nhà phân phối</option>
                <option v-for="npp in availableDistributors" :key="npp.maNPP" :value="npp.maNPP">
                  {{ npp.maNPP }} - {{ npp.tenNPP }}
                </option>
              </select>
            </div>
            <div v-if="selectedNPP" class="table-responsive">
              <table class="table table-bordered table-striped">
                <thead class="table-gray">
                  <tr>
                    <th class="px-4 py-2">Mã Thuốc</th>
                    <th class="px-4 py-2">Tên Thuốc</th>
                    <th class="px-4 py-2">Số Lượng Tồn</th>
                    <th class="px-4 py-2">Số Lượng Cần Nhập</th>
                    <th class="px-4 py-2">Đơn Vị Tính</th>
                    <th class="px-4 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in orderList" :key="index">
                    <td class="px-4 py-2">{{ item.maThuoc }}</td>
                    <td class="px-4 py-2">{{ item.tenThuoc }}</td>
                    <td class="px-4 py-2">{{ item.soluongThuoc }}</td>
                    <td class="px-4 py-2">
                      <input
                        type="number"
                        class="form-control"
                        v-model.number="item.soLuongCanNhap"
                        min="0"
                        @input="validateQuantity(index)"
                      />
                    </td>
                    <td class="px-4 py-2">{{ item.donvitinhThuoc }}</td>
                    <td class="px-4 py-2">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        @click="removeFromOrderList(index)"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!orderList || orderList.length === 0">
                    <td colspan="6" class="text-center">Không có thuốc nào để đặt hàng</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center">Vui lòng chọn nhà phân phối</div>
          </div>
          <div class-anywhere v-if="selectedNPP" class="d-flex justify-content-end m-4">
            <button
              type="button"
              class="btn btn-secondary me-2"
              data-bs-dismiss="modal"
              @click="closeOrderModal"
            >
              Đóng
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="!selectedNPP || orderList.length === 0"
              @click="placeOrder"
            >
              Đặt Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emailService from '../../services/email.service';
import logService from '../../services/log.service';
import log_detailsService from '../../services/log_details.service';

export default {
  props: {
    medicine: {
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
    distributors: {
      type: Object,
      validator: (data) => {
        return 'list' in data && Array.isArray(data.list);
      },
      required: true,
    },
    name: {
      type: String,
      default: 'Danh Sách Thuốc Gần Hết',
      required: true,
    },
  },
  emits: ['update:activeIndex', 'orderPlaced'],
  data() {
    return {
      selectedMedicine: null,
      selectedIndex: null,
      selectedNPP: '',
      orderList: [],
      search: {
        maThuoc: '',
        tenThuoc: '',
        maNPP: '',
      },
    };
  },
  computed: {
    filteredList() {
      if (!this.medicine || !this.medicine.list) return [];

      return this.medicine.list.filter((item) => {
        const searchMaThuoc = this.search.maThuoc ? this.search.maThuoc.toLowerCase() : '';
        const searchTenThuoc = this.search.tenThuoc ? this.search.tenThuoc.toLowerCase() : '';
        const searchMaNPP = this.search.maNPP ? this.search.maNPP : '';

        return (
          (!searchMaThuoc || (item.maThuoc && item.maThuoc.toLowerCase().includes(searchMaThuoc))) &&
          (!searchTenThuoc || (item.tenThuoc && item.tenThuoc.toLowerCase().includes(searchTenThuoc))) &&
          (!searchMaNPP || (item.maNPP && item.maNPP === searchMaNPP))
        );
      });
    },
    availableDistributors() {
      if (!this.medicine || !this.medicine.list || !this.distributors || !this.distributors.list) return [];

      // Lấy danh sách maNPP từ medicine.list
      const medicineNPPs = [...new Set(this.medicine.list.map(item => item.maNPP).filter(maNPP => maNPP))];
      // Lọc danh sách nhà phân phối chỉ bao gồm những nhà có trong medicine.list
      return this.distributors.list.filter(npp => medicineNPPs.includes(npp.maNPP));
    },
  },
  watch: {
    'medicine.list': {
      handler(newValue) {
        if (newValue) {
          this.selectedMedicine = null;
          this.selectedIndex = null;
          this.orderList = [];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    openMedicineModal(index) {
      this.selectedIndex = index;
      this.selectedMedicine = this.filteredList[index];
      this.$emit('update:activeIndex', index);
    },
    closeMedicineModal() {
      this.selectedMedicine = null;
      this.selectedIndex = null;
    },
    openOrderModal() {
      this.selectedNPP = '';
      this.orderList = [];
    },
    closeOrderModal() {
      this.selectedNPP = '';
      this.orderList = [];
    },

    updateOrderList() {
      if (!this.selectedNPP) {
        this.orderList = [];
        return;
      }
      this.orderList = this.medicine.list
        .filter((item) => item.maNPP === this.selectedNPP)
        .map((item) => ({
          ...item,
          soLuongCanNhap: 100 - (item.soluongThuoc || 0), // Gợi ý số lượng cần nhập
        }));
    },

    validateQuantity(index) {
      if (this.orderList[index].soLuongCanNhap < 0) {
        this.orderList[index].soLuongCanNhap = 0;
      }
    },

    removeFromOrderList(index) {
      this.orderList.splice(index, 1);
    },

    async placeOrder() {
      if (!this.selectedNPP || this.orderList.length === 0) {
        alert('Vui lòng chọn nhà phân phối và ít nhất một thuốc để đặt hàng!');
        return;
      }

      if (!confirm('Bạn có chắc chắn muốn đặt hàng?')) {
        return;
      }

      try {
        const npp = this.distributors.list.find((npp) => npp.maNPP === this.selectedNPP);
        if (!npp || !npp.emailNPP) {
          throw new Error('Không tìm thấy thông tin email của nhà phân phối!');
        }

        const orderDetails = this.orderList
          .filter((item) => item.soLuongCanNhap > 0)
          .map((item) => ({
            maThuoc: item.maThuoc,
            tenThuoc: item.tenThuoc,
            soLuong: item.soLuongCanNhap,
            donViTinh: item.donvitinhThuoc,
          }));

        if (orderDetails.length === 0) {
          alert('Không có thuốc nào có số lượng cần nhập lớn hơn 0!');
          return;
        }

        // Tạo nhật ký đặt hàng
        const ngaygoi = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại định dạng YYYY-MM-DD
        const logData = {
          maNPP: this.selectedNPP,
          ngaygoi: ngaygoi,
        };
        const logResponse = await logService.create(logData); // Giả định trả về maNK
        const maNK = logResponse.maNK; // Giả định API trả về mã nhật ký vừa tạo

        // Lưu chi tiết đặt hàng
        const logDetails = orderDetails.map((item) => ({
          maNK: maNK,
          maThuoc: item.maThuoc,
          soluong: item.soLuong,
          donvitinh: item.donViTinh,
        }));
        for (const detail of logDetails) {
          await log_detailsService.create(detail); // Lưu từng bản ghi riêng lẻ
        }

        const emailText = `
            Kính gửi ${npp.tenNPP},

            Chúng tôi xin gửi đơn đặt hàng với các chi tiết sau:
            ${orderDetails
              .map((item, index) => `${index + 1}. ${item.tenThuoc}: ${item.soLuong} ${item.donViTinh}`)
              .join('\n')}

            Trân trọng,
            [Clinic]
        `;

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p style="font-size: 16px;">Kính gửi ${npp.tenNPP},</p>
            <p style="font-size: 16px;">Chúng tôi xin gửi đơn đặt hàng với các chi tiết sau:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">STT</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Tên Thuốc</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Số Lượng</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Đơn Vị Tính</th>
                </tr>
                </thead>
                <tbody>
                ${orderDetails
                  .map(
                    (item, index) => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: left;">${index + 1}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: left;">${item.tenThuoc}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${item.soLuong}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: left;">${item.donViTinh}</td>
                </tr>`
                  )
                  .join('')}
                </tbody>
            </table>
            <p style="font-size: 16px;">Trân trọng,<br>[Clinic]</p>
            </body>
            </html>
        `;

        await emailService.sendEmail(npp.emailNPP, {
          subject: 'Đơn Đặt Hàng Thuốc',
          text: emailText,
          html: emailHtml,
        });

        alert('Đơn hàng đã được gửi và nhật ký đặt hàng đã được lưu thành công!');
        this.$emit('orderPlaced');
        this.closeOrderModal();
      } catch (error) {
        // alert(`Lỗi khi gửi đơn hàng hoặc lưu nhật ký: ${error.message}`);
        // console.error('Lỗi khi gửi đơn hàng hoặc lưu nhật ký:', error);
        const errorMessage = error.response?.data?.message || 'Lỗi khi gửi đơn hàng hoặc lưu nhật ký!';
        alert(errorMessage);
      }
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
      if (key === 'soluongThuoc' || key === 'soLuongCanNhap') {
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
  @import "@/assets/ordorDrug.css";
</style>