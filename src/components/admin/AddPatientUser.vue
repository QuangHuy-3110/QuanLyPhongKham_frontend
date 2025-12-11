<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">{{ mode === 'user' ? 'Thêm Người Dùng Mới' : 'Thêm Hồ Sơ Bệnh Nhân' }}</h3>
    <hr>
    <div class="card shadow-sm border-0">
      <div class="card-body">
        
        <div class="mb-4 d-flex justify-content-center">
            <div class="btn-group" role="group">
                <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" 
                       value="patient" v-model="mode" @change="resetForm">
                <label class="btn btn-outline-primary" for="btnradio1">Thêm Bệnh Nhân (Chỉ hồ sơ)</label>

                <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" 
                       value="user" v-model="mode" @change="resetForm">
                <label class="btn btn-outline-primary" for="btnradio2">Thêm Người Dùng (Kèm tài khoản)</label>
            </div>
        </div>

        <form id="patientForm" ref="patientForm" class="needs-validation" novalidate @submit.prevent="handleSubmit">
          
          <h5 class="mb-3 text-primary fw-bold">I. Thông Tin Cá Nhân</h5>
          <div class="row g-3 mb-4">
            
            <div class="col-md-6">
              <label for="cccdBN" class="form-label fw-bold">CCCD <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="cccdBN" v-model="form.cccdBN" 
                     pattern="\d{12}" required placeholder="Nhập 12 số CCCD" @input="validateCCCD">
              <div class="invalid-feedback">{{ errors.cccdBN || 'Vui lòng nhập đúng 12 số CCCD.' }}</div>
            </div>
            
            <div class="col-md-6">
              <label for="hotenBN" class="form-label fw-bold">Họ và Tên <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="hotenBN" v-model="form.hotenBN" 
                     required minlength="2" placeholder="Nhập họ và tên" @input="validateName">
              <div class="invalid-feedback">{{ errors.hotenBN || 'Họ tên phải từ 2 ký tự trở lên.' }}</div>
            </div>

            <div class="col-md-6">
              <label for="ngaysinhBN" class="form-label fw-bold">Ngày Sinh <span class="text-danger">*</span></label>
              <input type="date" class="form-control" id="ngaysinhBN" v-model="form.ngaysinhBN" 
                     required @change="validateDate">
              <div class="invalid-feedback">{{ errors.ngaysinhBN || 'Ngày sinh không hợp lệ.' }}</div>
            </div>

            <div class="col-md-6">
              <label for="sdtBN" class="form-label fw-bold">Số Điện Thoại <span class="text-danger">*</span></label>
              <input type="tel" class="form-control" id="sdtBN" v-model="form.sdtBN" 
                     pattern="\d{10}" required placeholder="Nhập 10 số điện thoại" @input="validatePhone">
              <div class="invalid-feedback">{{ errors.sdtBN || 'Số điện thoại phải là 10 số.' }}</div>
            </div>

            <div class="col-md-6">
              <label for="emailBN" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
              <input type="email" class="form-control" id="emailBN" v-model="form.emailBN" 
                     required placeholder="Nhập email" @input="validateEmail">
              <div class="invalid-feedback">{{ errors.emailBN || 'Email không hợp lệ.' }}</div>
            </div>

            <div class="col-md-6">
              <label for="diachiBN" class="form-label fw-bold">Địa Chỉ <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="diachiBN" v-model="form.diachiBN" 
                     required minlength="5" placeholder="Nhập địa chỉ" @input="validateAddress">
              <div class="invalid-feedback">{{ errors.diachiBN || 'Địa chỉ phải từ 5 ký tự trở lên.' }}</div>
            </div>
             
             <div class="col-md-12">
              <label for="soBHYT" class="form-label fw-bold">Số BHYT</label>
              <input type="text" class="form-control" id="soBHYT" v-model="form.soBHYT" 
                     pattern="[A-Z]{2}\d{13}" placeholder="Nhập số BHYT (VD: DN4...)" @input="validateBHYT">
              <div class="invalid-feedback">{{ errors.soBHYT || 'Số BHYT không hợp lệ (2 chữ + 13 số).' }}</div>
            </div>
          </div>

          <h5 class="mb-3 text-primary fw-bold">II. Chỉ Số Sức Khỏe</h5>
          <div class="row g-3 mb-4">
             <div class="col-md-4">
                <label for="chieucao" class="form-label fw-bold">Chiều cao (cm)</label>
                <input type="number" class="form-control" id="chieucao" v-model="form.chieucao" 
                       min="50" max="250" placeholder="VD: 170" @input="validateHeight">
                <div class="invalid-feedback">{{ errors.chieucao }}</div>
             </div>

             <div class="col-md-4">
                <label for="cannang" class="form-label fw-bold">Cân nặng (kg)</label>
                <input type="number" class="form-control" id="cannang" v-model="form.cannang" 
                       min="20" max="200" placeholder="VD: 60" @input="validateWeight">
                <div class="invalid-feedback">{{ errors.cannang }}</div>
             </div>

             <div class="col-md-4">
                <label for="nhommau" class="form-label fw-bold">Nhóm máu</label>
                <select id="nhommau" class="form-select" v-model="form.nhommau" @change="validateBloodGroup">
                    <option value="" selected>Chọn nhóm máu</option>
                    <option v-for="blood in bloodGroups" :key="blood" :value="blood">{{ blood }}</option>
                </select>
                <div class="invalid-feedback">{{ errors.nhommau }}</div>
             </div>
          </div>

          <div v-if="mode === 'user'">
              <h5 class="mb-3 text-primary fw-bold">III. Thông Tin Tài Khoản</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-12">
                    <label for="tendangnhapBN" class="form-label fw-bold">Tên Đăng Nhập <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="tendangnhapBN" v-model="form.tendangnhapBN" 
                           required minlength="3" placeholder="Nhập tên đăng nhập" @input="validateUsername">
                    <div class="invalid-feedback">{{ errors.tendangnhapBN || 'Tên đăng nhập phải từ 3 ký tự trở lên.' }}</div>
                </div>

                <div class="col-md-6">
                    <label for="matkhauBN" class="form-label fw-bold">Mật Khẩu <span class="text-danger">*</span></label>
                    <input type="password" class="form-control" id="matkhauBN" v-model="form.matkhauBN" 
                           required minlength="6" placeholder="Nhập mật khẩu" @input="validatePassword">
                    <div class="invalid-feedback">{{ errors.matkhauBN || 'Mật khẩu phải từ 6 ký tự trở lên.' }}</div>
                </div>

                <div class="col-md-6">
                    <label for="confirmMatkhauBN" class="form-label fw-bold">Nhập Lại Mật Khẩu <span class="text-danger">*</span></label>
                    <input type="password" class="form-control" id="confirmMatkhauBN" v-model="confirmMatkhauBN" 
                           required placeholder="Nhập lại mật khẩu" @input="validateConfirmPassword">
                    <div class="invalid-feedback">{{ errors.confirmMatkhauBN || 'Mật khẩu không khớp.' }}</div>
                </div>
              </div>
          </div>

          <div class="d-flex justify-content-center gap-3 mt-4">
            <button type="submit" class="btn btn-primary btn-lg">
                {{ mode === 'user' ? 'Đăng Ký Người Dùng' : 'Lưu Hồ Sơ Bệnh Nhân' }}
            </button>
            <button type="button" class="btn btn-secondary btn-lg" @click="resetForm">Làm Mới</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import patientService from '../../services/patient.service';
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      mode: 'patient', // 'patient' hoặc 'user'
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      confirmMatkhauBN: '',
      form: {
        cccdBN: '',
        hotenBN: '',
        ngaysinhBN: '',
        sdtBN: '',
        emailBN: '',
        diachiBN: '',
        soBHYT: '',
        chieucao: null,
        cannang: null,
        nhommau: '',
        // Các trường tài khoản
        tendangnhapBN: '',
        matkhauBN: ''
      },
      errors: {
        cccdBN: '', hotenBN: '', ngaysinhBN: '', sdtBN: '', emailBN: '', diachiBN: '',
        soBHYT: '', chieucao: '', cannang: '', nhommau: '',
        tendangnhapBN: '', matkhauBN: '', confirmMatkhauBN: ''
      }
    };
  },
  
  mounted() {
    this.initializeValidation();
  },

  methods: {
    initializeValidation() {
      const form = this.$refs.patientForm;
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

    // --- Validation Methods ---
    validateCCCD() {
      const regex = /^\d{12}$/;
      this.errors.cccdBN = !regex.test(this.form.cccdBN) ? 'CCCD phải là 12 số' : '';
    },
    validateName() {
      this.errors.hotenBN = this.form.hotenBN.length < 2 ? 'Họ tên phải từ 2 ký tự trở lên' : '';
    },
    validateDate() {
      const inputDate = new Date(this.form.ngaysinhBN);
      const today = new Date();
      this.errors.ngaysinhBN = (isNaN(inputDate) || inputDate > today) ? 'Ngày sinh không hợp lệ' : '';
    },
    validatePhone() {
      const regex = /^\d{10}$/;
      this.errors.sdtBN = !regex.test(this.form.sdtBN) ? 'Số điện thoại phải là 10 số' : '';
    },
    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors.emailBN = !regex.test(this.form.emailBN) ? 'Email không hợp lệ' : '';
    },
    validateAddress() {
      this.errors.diachiBN = this.form.diachiBN.length < 5 ? 'Địa chỉ phải từ 5 ký tự trở lên' : '';
    },
    validateBHYT() {
        if(!this.form.soBHYT) { this.errors.soBHYT = ''; return; }
        const regex = /^[A-Z]{2}\d{13}$/;
        this.errors.soBHYT = !regex.test(this.form.soBHYT) ? 'Số BHYT không hợp lệ' : '';
    },
    validateHeight() {
       const h = this.form.chieucao;
       this.errors.chieucao = (h && (h < 50 || h > 250)) ? 'Chiều cao: 50-250cm' : '';
    },
    validateWeight() {
       const w = this.form.cannang;
       this.errors.cannang = (w && (w < 20 || w > 200)) ? 'Cân nặng: 20-200kg' : '';
    },
    validateBloodGroup() {},
    
    validateUsername() {
        if (this.mode === 'user') {
            this.errors.tendangnhapBN = this.form.tendangnhapBN.length < 3 ? 'Tên đăng nhập >= 3 ký tự' : '';
        }
    },
    validatePassword() {
        if (this.mode === 'user') {
            this.errors.matkhauBN = this.form.matkhauBN.length < 6 ? 'Mật khẩu >= 6 ký tự' : '';
            this.validateConfirmPassword();
        }
    },
    validateConfirmPassword() {
        if (this.mode === 'user') {
            this.errors.confirmMatkhauBN = this.confirmMatkhauBN !== this.form.matkhauBN ? 'Mật khẩu không khớp' : '';
        }
    },

    async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    },

    parseDateForBackend(date) {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d)) return date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    async handleSubmit() {
      const formEl = this.$refs.patientForm;
      const hasCustomErrors = Object.values(this.errors).some(error => error !== '');
      if (!formEl.checkValidity() || hasCustomErrors) {
         formEl.classList.add('was-validated');
         return;
      }

      try {
        // Kiểm tra trùng CCCD
        let list = await patientService.get_cccd(this.form.cccdBN);
        if (list.length > 0) {
            alert("Bệnh nhân với CCCD này đã tồn tại trong hệ thống!");
            return;
        }

        // Kiểm tra trùng Tên đăng nhập (Chỉ khi mode User)
        if (this.mode === 'user') {
            let checkUser = await patientService.get_acname(this.form.tendangnhapBN);
            if (checkUser.length > 0) {
                alert("Tên đăng nhập đã tồn tại!");
                return;
            }
        }

        // --- CHUẨN BỊ DỮ LIỆU ---
        let dataToSubmit = { ...this.form };
        dataToSubmit.ngaysinhBN = this.parseDateForBackend(this.form.ngaysinhBN);

        if (this.mode === 'patient') {
            // [LOGIC MỚI]: Xóa hoàn toàn tên đăng nhập và mật khẩu
            // Điều này đảm bảo backend nhận được null/undefined và không tạo account
            delete dataToSubmit.tendangnhapBN;
            delete dataToSubmit.matkhauBN;
        } else {
            // Mode User: Giữ nguyên username, hash mật khẩu
            dataToSubmit.matkhauBN = await this.hashPassword(this.form.matkhauBN);
        }

        // Gọi Service
        await patientService.create(dataToSubmit);
        
        alert(this.mode === 'user' 
            ? "Đăng ký người dùng mới thành công!" 
            : "Thêm hồ sơ bệnh nhân thành công!");
        
        this.resetForm();
        // Có thể emit event để cha cập nhật danh sách
        this.$emit('formSubmitted');

      } catch (error) {
          console.error("Lỗi khi thêm dữ liệu:", error);
          const msg = error.response?.data?.message || "Có lỗi xảy ra khi thêm dữ liệu!";
          alert(msg);
      }
    },

    resetForm() {
      const currentMode = this.mode;
      this.form = {
        cccdBN: '', hotenBN: '', ngaysinhBN: '', sdtBN: '', emailBN: '', 
        diachiBN: '', soBHYT: '', chieucao: null, cannang: null, nhommau: '',
        tendangnhapBN: '', matkhauBN: ''
      };
      this.confirmMatkhauBN = '';
      this.mode = currentMode;
      
      const formEl = this.$refs.patientForm;
      if (formEl) formEl.classList.remove('was-validated');
      Object.keys(this.errors).forEach(key => this.errors[key] = '');
    }
  }
};
</script>

<style scoped>
@import "@/assets/addDoctor.css";

.btn-check:checked + .btn-outline-primary {
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
}
</style>