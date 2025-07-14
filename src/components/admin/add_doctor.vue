<template>
  <div class="container">
    <h3 class="mb-4 text-center fw-bold">Thêm Bác Sĩ</h3>
    <hr>
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <form id="doctorForm" ref="doctorForm" class="needs-validation" novalidate @submit.prevent="handleSubmit">
          <div class="row g-3">
            <!-- Nhóm 1: CCCD và Họ Tên -->
            <div class="col-md-6">
              <label for="cccdBS" class="form-label fw-bold">CCCD Bác Sĩ <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="cccdBS"
                name="cccdBS"
                v-model="form.cccdBS"
                pattern="\d{12}"
                required
                placeholder="Nhập 12 số CCCD"
              />
              <div class="invalid-feedback">Vui lòng nhập đúng 12 số CCCD.</div>
            </div>
            <div class="col-md-6">
              <label for="tenBS" class="form-label fw-bold">Họ và Tên <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="tenBS"
                name="tenBS"
                v-model="form.tenBS"
                required
                pattern="[\p{L}\s]+"
                placeholder="Nhập họ và tên"
              />
              <div class="invalid-feedback">Vui lòng nhập họ và tên (chỉ chứa chữ cái và khoảng trắng).</div>
            </div>
  
            <!-- Nhóm 2: Ngày Sinh và Số Điện Thoại -->
            <div class="col-md-6">
              <label for="ngaysinhBS" class="form-label fw-bold">Ngày Sinh <span class="text-danger">*</span></label>
              <input
                type="date"
                class="form-control"
                id="ngaysinhBS"
                name="ngaysinhBS"
                v-model="form.ngaysinhBS"
                required
                max="2007-12-31"
                @change="validateAge"
              />
              <div class="invalid-feedback">{{ ageError }}</div>
            </div>
            <div class="col-md-6">
              <label for="sdtBS" class="form-label fw-bold">Số Điện Thoại <span class="text-danger">*</span></label>
              <input
                type="tel"
                class="form-control"
                id="sdtBS"
                name="sdtBS"
                v-model="form.sdtBS"
                required
                pattern="0[1-9]\d{8}"
                placeholder="Nhập số điện thoại (bắt đầu bằng 0, 10 số)"
              />
              <div class="invalid-feedback">Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng 0).</div>
            </div>
  
            <!-- Nhóm 3: Email và Địa Chỉ -->
            <div class="col-md-6">
              <label for="emailBS" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                id="emailBS"
                name="emailBS"
                v-model="form.emailBS"
                required
                placeholder="Nhập email"
              />
              <div class="invalid-feedback">Vui lòng nhập email hợp lệ.</div>
            </div>
            <div class="col-md-6">
              <label for="diachiBS" class="form-label fw-bold">Địa Chỉ <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="diachiBS"
                name="diachiBS"
                v-model="form.diachiBS"
                required
                placeholder="Nhập địa chỉ"
              />
              <div class="invalid-feedback">Vui lòng nhập địa chỉ.</div>
            </div>
  
            <!-- Nhóm 4: Số CCHN và Nơi Cấp CCHN -->
            <div class="col-md-6">
              <label for="soCCHN" class="form-label fw-bold">Số CCHN <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="soCCHN"
                name="soCCHN"
                v-model="form.soCCHN"
                required
                pattern="[A-Za-z0-9]{6,20}"
                placeholder="Nhập số chứng chỉ hành nghề"
              />
              <div class="invalid-feedback">Vui lòng nhập số CCHN (6-20 ký tự chữ và số).</div>
            </div>
            <div class="col-md-6">
              <label for="noicapCCHN" class="form-label fw-bold">Nơi Cấp CCHN <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="noicapCCHN"
                name="noicapCCHN"
                v-model="form.noicapCCHN"
                required
                placeholder="Nhập nơi cấp CCHN"
              />
              <div class="invalid-feedback">Vui lòng nhập nơi cấp CCHN.</div>
            </div>
  
            <!-- Nhóm 5: Mã Chuyên Khoa và Tên Chuyên Khoa -->
            <div class="col-md-6">
              <label for="maCK" class="form-label fw-bold">Mã Chuyên Khoa <span class="text-danger">*</span></label>
              <select
                id="maCK"
                class="form-select"
                v-model="form.maCK"
                required
              >
                <option value="" disabled>Chọn mã chuyên khoa</option>
                <option v-for="specialty in specialties" :key="specialty.maCK" :value="specialty.maCK">
                  {{ specialty.maCK }}
                </option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn mã chuyên khoa.</div>
            </div>
            <div class="col-md-6">
              <label for="tenCK" class="form-label fw-bold">Tên Chuyên Khoa</label>
              <input
                type="text"
                class="form-control"
                id="tenCK"
                name="tenCK"
                v-model="form.tenCK"
                readonly
                placeholder="Tên chuyên khoa sẽ hiển thị ở đây"
              />
            </div>

            <!-- Nhóm 6: Vai Trò -->
            <div class="col-md-6">
              <label for="vaiTro" class="form-label fw-bold">Vai Trò <span class="text-danger">*</span></label>
              <select
                id="vaiTro"
                class="form-select"
                v-model="form.vaiTro"
                required
              >
                <option value="" disabled>Chọn vai trò</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DOCTOR">DOCTOR</option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn vai trò.</div>
            </div>
          </div>
  
          <div class="d-flex justify-content-center gap-3 mt-4">
            <button type="submit" class="btn btn-primary">Thêm Bác Sĩ</button>
            <button type="reset" class="btn btn-secondary" @click="resetForm">Xóa Form</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import doctorService from '../../services/doctor.service';
import doctor_roleService from '../../services/doctor_role.service';
import specialtiesService from '../../services/specialties.service';
import emailService from '../../services/email.service';
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      form: {
        cccdBS: '',
        tenBS: '',
        ngaysinhBS: '',
        sdtBS: '',
        emailBS: '',
        diachiBS: '',
        soCCHN: '',
        noicapCCHN: '',
        maCK: '',
        tenCK: '',
        matkhau: '',
        vaiTro: ''
      },
      chuyenkhoa: {
        maCK: '',
        maBS: ''
      },
      ageError: 'Vui lòng chọn ngày sinh hợp lệ (bác sĩ phải trên 18 tuổi).',
      specialties: []
    };
  },
  watch: {
    'form.maCK': function (newMaCK) {
      const selectedSpecialty = this.specialties.find(specialty => specialty.maCK === newMaCK);
      this.form.tenCK = selectedSpecialty ? selectedSpecialty.tenCK : '';
    }
  },
  mounted() {
    this.initializeValidation();
    this.get_specialties();
  },
  emits: ['formSubmitted'],
  methods: {
    async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    },
    async get_specialties() {
      try {
        this.specialties = await specialtiesService.getAll();
      } catch (error) {
        console.log("Lỗi khi lấy chuyên khoa:", error);
      }
    },
    initializeValidation() {
      const form = this.$refs.doctorForm;
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
    validateAge() {
      const birthDate = new Date(this.form.ngaysinhBS);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      const input = document.getElementById('ngaysinhBS');
      if (age < 18) {
        input.setCustomValidity('Bác sĩ phải trên 18 tuổi.');
        this.ageError = 'Bác sĩ phải trên 18 tuổi.';
      } else {
        input.setCustomValidity('');
        this.ageError = 'Vui lòng chọn ngày sinh hợp lệ (bác sĩ phải trên 18 tuổi).';
      }
    },
    async handleSubmit() {
      const form = this.$refs.doctorForm;
      if (form && form.checkValidity()) {
        try {
          this.form.matkhau = await this.hashPassword('1');
          this.chuyenkhoa.maCK = this.form.maCK;
          delete this.form.maCK;
          delete this.form.tenCK;

          await doctorService.create(this.form);
          let doctor = await doctorService.get_cccd(this.form.cccdBS);

          this.chuyenkhoa.maBS = doctor[0].maBS;
          await doctor_roleService.create(this.chuyenkhoa);
          alert('Thêm bác sĩ thành công!');
          await emailService.sendEmail(
            doctor[0].emailBS,
            `Tài khoản bác sĩ của bạn đã được tạo!`,
            `Chào bạn, đây là email thông báo tài khoản bác sĩ của bạn đã được tạo thành công. Thông tin tài khoản của bạn như sau:
            Mã bác sĩ: ${doctor[0].maBS}.
            CCCD: ${doctor[0].cccdBS}.                  Tên bác sĩ: ${doctor[0].tenBS}. 
            Ngày sinh: ${doctor[0].ngaysinhBS}.         Số điện thoại: ${doctor[0].sdtBS}.
            Email: ${doctor[0].emailBS}.                Địa chỉ: ${doctor[0].diachiBS}.
            Số CCHN: ${doctor[0].soCCHN}.               Nơi cấp CCHN: ${doctor[0].noicapCCHN}.
            Tên chuyên khoa: ${doctor[0].tenCK}.        Vai trò: ${doctor[0].vaiTro}.
            Tên đăng nhập: ${doctor[0].maBS}.           Tài khoản của bạn có vai trò là ${doctor[0].vaiTro}. 
            Mật khẩu mặc định là "1". 
            Vui lòng đăng nhập và thay đổi mật khẩu ngay sau khi đăng nhập lần đầu tiên.`
          );
          this.resetForm();
          this.$emit('formSubmitted');
        } catch (error) {
          console.error('Lỗi khi thêm bác sĩ:', error);
          alert('Thêm bác sĩ thất bại!');
        }
      } else if (form) {
        form.classList.add('was-validated');
      }
    },
    resetForm() {
      this.form = {
        cccdBS: '',
        tenBS: '',
        ngaysinhBS: '',
        sdtBS: '',
        emailBS: '',
        diachiBS: '',
        soCCHN: '',
        noicapCCHN: '',
        maCK: '',
        tenCK: '',
        matkhau: '',
        vaiTro: ''
      };
      this.chuyenkhoa = {
        maBS: '',
        maCK: ''
      };
      const form = this.$refs.doctorForm;
      if (form) {
        form.classList.remove('was-validated');
      }
      
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 8px;
  background-color: #fff;
}
.card-body {
  padding: 1.5rem;
}
.form-label {
  color: #333;
  font-weight: 500;
}
.form-control, .form-select {
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}
.form-control:focus, .form-select:focus {
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  border-color: #007bff;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
}
.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
}
.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}
.invalid-feedback {
  font-size: 0.875rem;
}
hr {
  border-top: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
}
@media (max-width: 768px) {
  .container {
    margin: 1rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  .card-body {
    padding: 1rem;
  }
  .form-label {
    font-size: 0.9rem;
  }
  .form-control, .form-select {
    font-size: 0.9rem;
  }
  .btn-primary, .btn-secondary {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  .invalid-feedback {
    font-size: 0.8rem;
  }
  .hr {
    margin-bottom: 1rem;
  }
}
</style>