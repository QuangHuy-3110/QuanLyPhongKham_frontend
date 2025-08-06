<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">{{ name }}</h3>
    <hr>
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <form id="hoaDonForm" ref="hoaDonForm" class="needs-validation" novalidate @submit.prevent="handleSubmit">
          <!-- Thông tin chung -->
          <h5 class="mb-3 fw-bold">Thông Tin Hóa Đơn</h5>
          <div class="row g-3">
            <!-- Mã Hóa Đơn và Mã Nhà Phân Phối -->
            <div class="col-md-6">
              <label for="maHD" class="form-label fw-bold">Mã Hóa Đơn <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="maHD"
                name="maHD"
                v-model="form.maHD"
                pattern="^HD\d{3}$"
                required
                placeholder="VD: HD001"
              />
              <div class="invalid-feedback">Vui lòng nhập mã hóa đơn theo định dạng HDxxx (xxx là 3 chữ số).</div>
            </div>
            <div class="col-md-6">
              <label for="maNPP" class="form-label fw-bold">Mã Nhà Phân Phối <span class="text-danger">*</span></label>
              <select
                id="maNPP"
                class="form-select"
                v-model="form.maNPP"
                required
                @change="resetChiTietOnNPPChange"
              >
                <option value="" disabled>Chọn mã nhà phân phối</option>
                <option v-for="npp in distributors" :key="npp.maNPP" :value="npp.maNPP">
                  {{ npp.maNPP }} - {{ npp.tenNPP }}
                </option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn mã nhà phân phối.</div>
            </div>

            <!-- Ngày Nhập và Tổng Tiền -->
            <div class="col-md-6">
              <label for="ngaynhap" class="form-label fw-bold">Ngày Nhập <span class="text-danger">*</span></label>
              <input
                type="date"
                class="form-control"
                id="ngaynhap"
                name="ngaynhap"
                v-model="form.ngaynhap"
                required
                :max="currentDate"
              />
              <div class="invalid-feedback">Vui lòng chọn ngày nhập hợp lệ (không quá ngày hiện tại).</div>
            </div>
            <div class="col-md-6">
              <label for="tongtien" class="form-label fw-bold">Tổng Tiền</label>
              <input
                type="text"
                class="form-control"
                id="tongtien"
                name="tongtien"
                :value="tongtien"
                readonly
                placeholder="Tổng tiền sẽ hiển thị ở đây"
              />
            </div>
          </div>

          <!-- Chi tiết hóa đơn -->
          <h5 class="mt-4 mb-3 fw-bold">Chi Tiết Hóa Đơn</h5>
          <div v-for="(chiTiet, index) in form.chiTietHoaDon" :key="index" class="row g-3 mb-3 align-items-end">
            <!-- Mã Thuốc -->
            <div class="col-md-2">
              <label :for="'maThuoc-' + index" class="form-label fw-bold">Mã Thuốc <span class="text-danger">*</span></label>
              <select
                :id="'maThuoc-' + index"
                class="form-select"
                v-model="chiTiet.maThuoc"
                required
                @change="updateTenThuoc(index)"
              >
                <option value="" disabled>Chọn mã thuốc</option>
                <option v-for="thuoc in filteredMedicine" :key="thuoc.maThuoc" :value="thuoc.maThuoc">
                  {{ thuoc.maThuoc }} - {{ thuoc.tenThuoc }}
                </option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn mã thuốc.</div>
            </div>

            <!-- Tên Thuốc (Readonly) -->
            <div class="col-md-2">
              <label :for="'tenThuoc-' + index" class="form-label fw-bold">Tên Thuốc</label>
              <input
                :id="'tenThuoc-' + index"
                class="form-control"
                v-model="chiTiet.tenThuoc"
                readonly
                placeholder="Tên thuốc sẽ hiển thị ở đây"
              />
            </div>

            <!-- Số Lượng -->
            <div class="col-md-2">
              <label :for="'soluong-' + index" class="form-label fw-bold">Số Lượng <span class="text-danger">*</span></label>
              <input
                :id="'soluong-' + index"
                type="number"
                class="form-control"
                v-model.number="chiTiet.soluong"
                required
                min="1"
                @input="updateThanhTien(index)"
              />
              <div class="invalid-feedback">Vui lòng nhập số lượng (số nguyên dương).</div>
            </div>

            <!-- Đơn Vị Tính -->
            <div class="col-md-1">
              <label :for="'donvitinh-' + index" class="form-label fw-bold">ĐVT <span class="text-danger">*</span></label>
              <input
                :id="'donvitinh-' + index"
                type="text"
                class="form-control"
                v-model="chiTiet.donvitinh"
                required
                maxlength="50"
                placeholder="VD: Viên"
              />
              <div class="invalid-feedback">Vui lòng nhập đơn vị tính (tối đa 50 ký tự).</div>
            </div>

            <!-- Đơn Giá -->
            <div class="col-md-2">
              <label :for="'dongia-' + index" class="form-label fw-bold">Đơn Giá <span class="text-danger">*</span></label>
              <input
                :id="'dongia-' + index"
                type="number"
                class="form-control"
                v-model.number="chiTiet.dongia"
                required
                min="0"
                step="0.01"
                @input="updateThanhTien(index)"
              />
              <div class="invalid-feedback">Vui lòng nhập đơn giá (không âm).</div>
            </div>

            <!-- Thành Tiền -->
            <div class="col-md-2">
              <label :for="'thanhtien-' + index" class="form-label fw-bold">Thành Tiền</label>
              <input
                :id="'thanhtien-' + index"
                type="text"
                class="form-control"
                :value="chiTiet.thanhtien"
                readonly
                placeholder="Thành tiền"
              />
            </div>

            <!-- Nút Xóa Chi Tiết -->
            <div class="col-md-1">
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="removeChiTiet(index)"
                :disabled="form.chiTietHoaDon.length === 1"
              >
                Xóa
              </button>
            </div>
          </div>

          <!-- Nút Thêm Chi Tiết -->
          <div class="mb-3">
            <button type="button" class="btn btn-outline-primary" @click="addChiTiet">Thêm Chi Tiết Hóa Đơn</button>
          </div>

          <!-- Nút Submit và Reset -->
          <div class="d-flex justify-content-center gap-3 mt-4">
            <button type="submit" class="btn btn-primary">Thêm Hóa Đơn</button>
            <button type="reset" class="btn btn-secondary" @click="resetForm">Xóa Form</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import invoiceService from '../../services/invoice.service';
import invoice_detailsService from '../../services/invoice_details.service';
import drugService from '../../services/drug.service';
import WebSocketService from '../../services/ws.service';

export default {
  props: {
    name: { type: String, required: true },
    medicine: { type: Array, required: true },
    distributors: { type: Array, required: true }
  },
  data() {
    return {
      wsService: new WebSocketService(),
      form: {
        maHD: '',
        maNPP: '',
        ngaynhap: '',
        chiTietHoaDon: [
          {
            maThuoc: '',
            tenThuoc: '',
            soluong: 1,
            donvitinh: '',
            dongia: 0,
            thanhtien: 0
          }
        ]
      },
      currentDate: new Date().toISOString().split('T')[0]
    };
  },

  computed: {
    tongtien() {
      return this.form.chiTietHoaDon.reduce((total, chiTiet) => total + chiTiet.thanhtien, 0).toFixed(2);
    },
    filteredMedicine() {
      if (!this.form.maNPP) {
        return [];
      }
      return this.medicine.filter(thuoc => thuoc.maNPP === this.form.maNPP);
    }
  },

  mounted() {
    this.initializeValidation();
  },

  emits: ['formSubmitted'],

  methods: {
    initializeValidation() {
      const form = this.$refs.hoaDonForm;
      if (form) {
        form.addEventListener('submit', (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      }
    },

    updateTenThuoc(index) {
      const chiTiet = this.form.chiTietHoaDon[index];
      const selectedThuoc = this.filteredMedicine.find(thuoc => thuoc.maThuoc === chiTiet.maThuoc);
      chiTiet.tenThuoc = selectedThuoc ? selectedThuoc.tenThuoc : '';
      chiTiet.donvitinh = selectedThuoc ? selectedThuoc.donvitinhThuoc : '';
      this.updateThanhTien(index);
    },

    updateThanhTien(index) {
      const chiTiet = this.form.chiTietHoaDon[index];
      chiTiet.thanhtien = (chiTiet.soluong * chiTiet.dongia);
    },

    addChiTiet() {
      this.form.chiTietHoaDon.push({
        maThuoc: '',
        tenThuoc: '',
        soluong: 1,
        donvitinh: '',
        dongia: 0,
        thanhtien: 0
      });
    },

    removeChiTiet(index) {
      if (this.form.chiTietHoaDon.length > 1) {
        this.form.chiTietHoaDon.splice(index, 1);
      }
    },

    resetChiTietOnNPPChange() {
      this.form.chiTietHoaDon = [{
        maThuoc: '',
        tenThuoc: '',
        soluong: 1,
        donvitinh: '',
        dongia: 0,
        thanhtien: 0
      }];
    },

    async handleSubmit() {
      const form = this.$refs.hoaDonForm;
      if (form && form.checkValidity()) {
        try {
          const hoaDonData = {
            maHD: this.form.maHD,
            maNPP: this.form.maNPP,
            ngaynhap: this.form.ngaynhap,
            tongtien: this.tongtien
          };
          await invoiceService.create(hoaDonData);

          for (const chiTiet of this.form.chiTietHoaDon) {
            const chiTietData = {
              maHD: this.form.maHD,
              maThuoc: chiTiet.maThuoc,
              soluong: chiTiet.soluong,
              donvitinh: chiTiet.donvitinh,
              dongia: chiTiet.dongia,
              thanhtien: chiTiet.thanhtien
            };
            await invoice_detailsService.create(chiTietData);
          }

          // Cập nhật số lượng thuốc
          for (const chiTiet of this.form.chiTietHoaDon) {
            let thuoc = this.medicine.find(thuoc => thuoc.maThuoc === chiTiet.maThuoc);
            if (thuoc) {
              thuoc.giaThuoc = chiTiet.dongia + (chiTiet.dongia * 20 / 100)
              thuoc.soluongThuoc = (thuoc.soluongThuoc || 0) + chiTiet.soluong;
              await drugService.update(chiTiet.maThuoc, thuoc);
            }
          }

          alert('Thêm hóa đơn thành công!');
          this.resetForm();
          this.$emit('formSubmitted');

          this.wsService.send({
            type: 'interact_drug',
            sender: 'Admin',
            data: this.form
          });

        } catch (error) {
          // console.error('Lỗi khi thêm hóa đơn hoặc cập nhật số lượng thuốc:', error);
          // alert('Thêm hóa đơn thất bại!');
          const errorMessage = error.response?.data?.message || 'Thêm hóa đơn thất bại!';
          alert(errorMessage);
        }
      } else if (form) {
        form.classList.add('was-validated');
      }
    },

    resetForm() {
      this.form = {
        maHD: '',
        maNPP: '',
        ngaynhap: '',
        chiTietHoaDon: [
          {
            maThuoc: '',
            tenThuoc: '',
            soluong: 1,
            donvitinh: '',
            dongia: 0,
            thanhtien: 0
          }
        ]
      };

      const form = this.$refs.hoaDonForm;
      if (form) {
        form.classList.remove('was-validated');
      }
    }
  },

    created() {
    this.wsService.connect();
  },

  beforeDestroy() {
    this.wsService.disconnect();
  }

};
</script>

<style scoped>
@import "@/assets/addInvoice.css";
</style>