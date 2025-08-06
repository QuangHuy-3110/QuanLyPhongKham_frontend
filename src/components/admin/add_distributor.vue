```vue
<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">Thêm Nhà Phân Phối</h3>
    <hr>
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <form id="nhaPhanPhoiForm" ref="nhaPhanPhoiForm" class="needs-validation" novalidate @submit.prevent="handleSubmit">
          <div class="row g-3">
            <!-- Nhóm 1: Mã Nhà Phân Phối và Tên Nhà Phân Phối -->
            <div class="col-md-6">
              <label for="maNPP" class="form-label fw-bold">Mã Nhà Phân Phối <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="maNPP"
                name="maNPP"
                v-model="form.maNPP"
                pattern="^NPP\d{3}$"
                required
                placeholder="VD: NPP001"
              />
              <div class="invalid-feedback">Vui lòng nhập mã nhà phân phối theo định dạng NPPxxx (xxx là 3 chữ số).</div>
            </div>
            <div class="col-md-6">
              <label for="tenNPP" class="form-label fw-bold">Tên Nhà Phân Phối <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="tenNPP"
                name="tenNPP"
                v-model="form.tenNPP"
                required
                pattern="[\p{L}\s0-9]+"
                maxlength="100"
                placeholder="Nhập tên nhà phân phối"
              />
              <div class="invalid-feedback">Vui lòng nhập tên nhà phân phối (chỉ chứa chữ cái, số và khoảng trắng, tối đa 100 ký tự).</div>
            </div>

            <!-- Nhóm 2: Địa Chỉ và Số Điện Thoại -->
            <div class="col-md-6">
              <label for="diachiNPP" class="form-label fw-bold">Địa Chỉ <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="diachiNPP"
                name="diachiNPP"
                v-model="form.diachiNPP"
                required
                maxlength="200"
                placeholder="Nhập địa chỉ"
              />
              <div class="invalid-feedback">Vui lòng nhập địa chỉ (tối đa 200 ký tự).</div>
            </div>
            <div class="col-md-6">
              <label for="sdtNPP" class="form-label fw-bold">Số Điện Thoại <span class="text-danger">*</span></label>
              <input
                type="tel"
                class="form-control"
                id="sdtNPP"
                name="sdtNPP"
                v-model="form.sdtNPP"
                required
                pattern="0[1-9]\d{8}"
                placeholder="VD: 0901234567"
              />
              <div class="invalid-feedback">Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng 0).</div>
            </div>

            <!-- Nhóm 3: Email và Số Tài Khoản -->
            <div class="col-md-6">
              <label for="emailNPP" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                id="emailNPP"
                name="emailNPP"
                v-model="form.emailNPP"
                required
                placeholder="VD: example@npp.com"
              />
              <div class="invalid-feedback">Vui lòng nhập email hợp lệ.</div>
            </div>
            <div class="col-md-6">
              <label for="stkNPP" class="form-label fw-bold">Số Tài Khoản <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="stkNPP"
                name="stkNPP"
                v-model="form.stkNPP"
                required
                pattern="\d{1,20}"
                placeholder="Nhập số tài khoản ngân hàng"
              />
              <div class="invalid-feedback">Vui lòng nhập số tài khoản (chỉ chứa số, tối đa 20 ký tự).</div>
            </div>

            <!-- Nhóm 4: Ngân Hàng -->
            <div class="col-md-6">
              <label for="nganhangNPP" class="form-label fw-bold">Ngân Hàng <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="nganhangNPP"
                name="nganhangNPP"
                v-model="form.nganhangNPP"
                required
                pattern="[\p{L}\s0-9]+"
                maxlength="100"
                placeholder="Nhập tên ngân hàng"
              />
              <div class="invalid-feedback">Vui lòng nhập tên ngân hàng (chỉ chứa chữ cái, số và khoảng trắng, tối đa 100 ký tự).</div>
            </div>
          </div>

          <div class="d-flex justify-content-center gap-3 mt-4">
            <button type="submit" class="btn btn-primary">Thêm Nhà Phân Phối</button>
            <button type="reset" class="btn btn-secondary" @click="resetForm">Xóa Form</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import distributorService from '../../services/distributor.service'
// import nhaPhanPhoiService from '../../services/nhaPhanPhoi.service';

export default {
  data() {
    return {
      form: {
        maNPP: '',
        tenNPP: '',
        diachiNPP: '',
        sdtNPP: '',
        emailNPP: '',
        stkNPP: '',
        nganhangNPP: ''
      }
    };
  },
  mounted() {
    this.initializeValidation();
  },
  emits: ['formSubmitted'],
  methods: {
    initializeValidation() {
      const form = this.$refs.nhaPhanPhoiForm;
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
    async handleSubmit() {
      const form = this.$refs.nhaPhanPhoiForm;
      if (form && form.checkValidity()) {
        try {
          // Gửi dữ liệu nhà phân phối đến backend
          await distributorService.create(this.form);
          console.log(this.form)
          alert('Thêm nhà phân phối thành công!');
          this.resetForm();
          this.$emit('formSubmitted');
        } catch (error) {
          // console.error('Lỗi khi thêm nhà phân phối:', error);
          // alert('Thêm nhà phân phối thất bại!');
          const errorMessage = error.response?.data?.message || 'Thêm nhà phân phối thất bại!';
          alert(errorMessage);
        }
      } else if (form) {
        form.classList.add('was-validated');
      }
    },
    resetForm() {
      this.form = {
        maNPP: '',
        tenNPP: '',
        diachiNPP: '',
        sdtNPP: '',
        emailNPP: '',
        stkNPP: '',
        nganhangNPP: ''
      };
      const form = this.$refs.nhaPhanPhoiForm;
      if (form) {
        form.classList.remove('was-validated');
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/addDistributor.css";
</style>
```