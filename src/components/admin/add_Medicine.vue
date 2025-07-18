<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">Thêm Thuốc</h3>
    <hr>
    <div class="card shadow-sm border-0 mb-4 pt-2">
      <div class="card-body">
        <form @submit.prevent="submitForm" novalidate>
          <div class="row g-3">
            <!-- Mã thuốc -->
            <div class="col-md-6">
              <label for="maThuoc" class="form-label fw-bold">Mã Thuốc <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="maThuoc"
                v-model="form.maThuoc"
                pattern="[A-Za-z0-9]{6,20}"
                required
                @input="validateMaThuoc"
              />
              <div class="invalid-feedback" v-if="errors.maThuoc">{{ errors.maThuoc }}</div>
            </div>

            <!-- Tên thuốc -->
            <div class="col-md-6">
              <label for="tenThuoc" class="form-label fw-bold">Tên Thuốc <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="tenThuoc"
                v-model="form.tenThuoc"
                pattern="[A-Za-z0-9\s]{2,50}"
                required
                @input="validateTenThuoc"
              />
              <div class="invalid-feedback" v-if="errors.tenThuoc">{{ errors.tenThuoc }}</div>
            </div>

            <!-- Số lượng thuốc -->
            <div class="col-md-6">
              <label for="soluongThuoc" class="form-label fw-bold">Số Lượng Thuốc <span class="text-danger">*</span></label>
              <input
                type="number"
                class="form-control"
                id="soluongThuoc"
                v-model.number="form.soluongThuoc"
                min="1"
                required
                @input="validateSoluongThuoc"
              />
              <div class="invalid-feedback" v-if="errors.soluongThuoc">{{ errors.soluongThuoc }}</div>
            </div>

            <!-- Đơn vị tính -->
            <div class="col-md-6">
              <label for="donvitinhThuoc" class="form-label fw-bold">Đơn Vị Tính <span class="text-danger">*</span></label>
              <select
                class="form-select"
                id="donvitinhThuoc"
                v-model="form.donvitinhThuoc"
                required
                @change="validateDonvitinhThuoc"
              >
                <option value="" disabled>Chọn đơn vị tính</option>
                <option value="Viên">Viên</option>
                <option value="Vỉ">Vỉ</option>
                <option value="Hộp">Hộp</option>
                <option value="Lọ">Lọ</option>
              </select>
              <div class="invalid-feedback" v-if="errors.donvitinhThuoc">{{ errors.donvitinhThuoc }}</div>
            </div>

            <!-- Nơi sản xuất -->
            <div class="col-md-6">
              <label for="noisanxuatThuoc" class="form-label fw-bold">Nơi Sản Xuất <span class="text-danger">*</span></label>
              <select
                class="form-select"
                id="noisanxuatThuoc"
                v-model="form.maNPP"
                required
                @change="validateNoisanxuatThuoc"
              >
                <option value="" disabled>Chọn nơi sản xuất</option>
                <option v-for="distributor in distributors" :value="distributor.maNPP" :key="distributor.maNPP">
                  {{ distributor.maNPP }} - {{ distributor.tenNPP }}
                </option>
              </select>
              <div class="invalid-feedback" v-if="errors.noisanxuatThuoc">{{ errors.noisanxuatThuoc }}</div>
            </div>

            <!-- Số lượng tối thiểu -->
            <div class="col-md-6">
              <label for="soluong_minThuoc" class="form-label fw-bold">Số Lượng Tối Thiểu <span class="text-danger">*</span></label>
              <input
                type="number"
                class="form-control"
                id="soluong_minThuoc"
                v-model.number="form.soluong_minThuoc"
                min="0"
                required
                @input="validateSoluongMinThuoc"
              />
              <div class="invalid-feedback" v-if="errors.soluong_minThuoc">{{ errors.soluong_minThuoc }}</div>
            </div>
          </div>

          <!-- Nút submit -->
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary">Thêm Thuốc</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import drugService from '../../services/drug.service';
import WebSocketService from '../../services/ws.service';

export default {
  props: {
    distributors: { type: Array, required: true }
  },

  data() {
    return {
      wsService: new WebSocketService(),
      form: {
        maThuoc: '',
        tenThuoc: '',
        soluongThuoc: null,
        donvitinhThuoc: '',
        maNPP: '',
        soluong_minThuoc: null
      },
      errors: {
        maThuoc: '',
        tenThuoc: '',
        soluongThuoc: '',
        donvitinhThuoc: '',
        noisanxuatThuoc: '',
        soluong_minThuoc: ''
      }
    };
  },

  emits: ['formSubmitted'],

  methods: {
    validateMaThuoc() {
      const input = this.form.maThuoc;
      const pattern = /^[A-Za-z0-9]{6,20}$/;
      if (!input) {
        this.errors.maThuoc = 'Mã thuốc là bắt buộc.';
      } else if (!pattern.test(input)) {
        this.errors.maThuoc = 'Mã thuốc phải có 6-20 ký tự, chỉ chứa chữ cái và số.';
      } else {
        this.errors.maThuoc = '';
      }
    },

    validateTenThuoc() {
      const input = this.form.tenThuoc;
      const pattern = /^[A-Za-z0-9\s]{2,50}$/;
      if (!input) {
        this.errors.tenThuoc = 'Tên thuốc là bắt buộc.';
      } else if (!pattern.test(input)) {
        this.errors.tenThuoc = 'Tên thuốc phải có 2-50 ký tự, chỉ chứa chữ cái, số và khoảng trắng.';
      } else {
        this.errors.tenThuoc = '';
      }
    },

    validateSoluongThuoc() {
      const input = this.form.soluongThuoc;
      if (input === null || input === '') {
        this.errors.soluongThuoc = 'Số lượng thuốc là bắt buộc.';
      } else if (!Number.isInteger(input) || input <= 0) {
        this.errors.soluongThuoc = 'Số lượng thuốc phải là số nguyên dương.';
      } else {
        this.errors.soluongThuoc = '';
      }
    },

    validateDonvitinhThuoc() {
      const input = this.form.donvitinhThuoc;
      if (!input) {
        this.errors.donvitinhThuoc = 'Vui lòng chọn đơn vị tính.';
      } else {
        this.errors.donvitinhThuoc = ''; 
      }
    },

    validateNoisanxuatThuoc() {
      const input = this.form.maNPP;
      if (!input) {
        this.errors.noisanxuatThuoc = 'Vui lòng chọn nơi sản xuất.';
      } else {
        this.errors.noisanxuatThuoc = '';
      }
    },

    validateSoluongMinThuoc() {
      const input = this.form.soluong_minThuoc;
      if (input === null || input === '') {
        this.errors.soluong_minThuoc = 'Số lượng tối thiểu là bắt buộc.';
      } else if (!Number.isInteger(input) || input < 0) {
        this.errors.soluong_minThuoc = 'Số lượng tối thiểu phải là số nguyên không âm.';
      } else {
        this.errors.soluong_minThuoc = '';
      }
    },

    async submitForm() {
      this.validateMaThuoc();
      this.validateTenThuoc();
      this.validateSoluongThuoc();
      this.validateDonvitinhThuoc();
      this.validateNoisanxuatThuoc();
      this.validateSoluongMinThuoc();

      const hasErrors = Object.values(this.errors).some((error) => error !== '');
      if (hasErrors) {
        const form = this.$el.querySelector('form');
        form.classList.add('was-validated');
        return;
      }
      try {
        await drugService.create(this.form);
        alert('Thêm thuốc mới thành công!');
        this.$emit('formSubmitted');

        this.wsService.send({
          type: 'interact_drug',
          sender: 'Admin',
          data: this.form
        });
        
      } catch (error) {
        alert('Lỗi khi thêm thuốc mới!');
        console.log('Lỗi khi thêm thuốc mới:', error);
      }

      this.form = {
        maThuoc: '',
        tenThuoc: '',
        soluongThuoc: null,
        donvitinhThuoc: '',
        noisanxuatThuoc: '',
        soluong_minThuoc: null
      };
      this.errors = {
        maThuoc: '',
        tenThuoc: '',
        soluongThuoc: '',
        donvitinhThuoc: '',
        noisanxuatThuoc: '',
        soluong_minThuoc: ''
      };
      this.$el.querySelector('form').classList.remove('was-validated');
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
@import "@/assets/addMedicine.css";
</style>