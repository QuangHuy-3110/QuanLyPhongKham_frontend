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

            <!-- Nhóm 6: Vai Trò và giới thiệu-->
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

            <div class="col-12">
              <label for="gioithieu" class="form-label fw-bold">Giới Thiệu Bác Sĩ</label>
              <textarea
                class="form-control"
                id="gioithieu"
                name="gioithieu"
                v-model="form.gioithieu"
                rows="3"
                placeholder="Nhập giới thiệu về bác sĩ"
              ></textarea>
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
import { ErrorCodes } from 'vue';

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
        vaiTro: '',
        gioithieu: ''
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

    async handleSubmit() {
      const form = this.$refs.doctorForm;
      if (form && form.checkValidity()) {
        try {
          this.form.matkhau = await this.hashPassword('1');
          this.chuyenkhoa.maCK = this.form.maCK;
          delete this.form.maCK;
          delete this.form.tenCK;

          await doctorService.create(this.form);
          let doctors = await doctorService.get_cccd(this.form.cccdBS);
          console.log(doctors[0])
          let doctor = this.formatEditRow(doctors[0])
          console.log(doctor)
          this.chuyenkhoa.maBS = doctor.maBS;
          await doctor_roleService.create(this.chuyenkhoa);
          alert('Thêm bác sĩ thành công!');

          const content = this.generateDoctorAccountEmailContent(doctor.emailBS, doctor);
          await emailService.sendEmail(doctor.emailBS, content);

          this.resetForm();
          this.$emit('formSubmitted');
        } catch (error) {
          // console.error('Lỗi khi thêm bác sĩ:', error);
          // alert('Thêm bác sĩ thất bại!');
          // Hiển thị thông báo lỗi cụ thể từ backend
            const errorMessage = error.response?.data?.message || 'Thêm bác sĩ thất bại!';
            alert(errorMessage);
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
        vaiTro: '',
        gioithieu: ''
      };
      this.chuyenkhoa = {
        maBS: '',
        maCK: ''
      };
      const form = this.$refs.doctorForm;
      if (form) {
        form.classList.remove('was-validated');
      }
      
    },

    generateDoctorAccountEmailContent(email, doctor) {
      const textContent = `Kính gửi ${doctor.tenBS || 'Bác sĩ'},

      Đây là email thông báo tài khoản bác sĩ của bạn đã được tạo thành công. Thông tin tài khoản của bạn như sau:

      - Mã bác sĩ: ${doctor.maBS}
      - CCCD: ${doctor.cccdBS}
      - Tên bác sĩ: ${doctor.tenBS}
      - Ngày sinh: ${doctor.ngaysinhBS}
      - Số điện thoại: ${doctor.sdtBS}
      - Email: ${doctor.emailBS}
      - Địa chỉ: ${doctor.diachiBS}
      - Số CCHN: ${doctor.soCCHN}
      - Nơi cấp CCHN: ${doctor.noicapCCHN}
      - Tên chuyên khoa: ${doctor.tenCK}
      - Vai trò: ${doctor.vaiTro}
      - Tên đăng nhập: ${doctor.maBS}
      - Giới thiệu: ${doctor.gioithieu}
      - Mật khẩu mặc định: 1

      Vui lòng đăng nhập và thay đổi mật khẩu ngay sau khi đăng nhập lần đầu tiên.

      Trân trọng,
      Phòng Khám`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; color: #333; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            .header { background-color: #007bff; padding: 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 500; }
            .content { padding: 30px; text-align: center; }
            .content p { margin: 0 0 15px; font-size: 16px; line-height: 1.5; }
            .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            .info-table .label { font-weight: bold; width: 40%; }
            .highlight { font-weight: bold; color: #007bff; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666; }
            .footer p { margin: 0; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Tài Khoản Bác Sĩ Đã Được Tạo</h1>
            </div>
            <div class="content">
              <p>Kính gửi ${doctor.tenBS || 'Bác sĩ'},</p>
              <p>Chúng tôi xin thông báo tài khoản bác sĩ của bạn đã được tạo thành công. Dưới đây là thông tin tài khoản:</p>
              <table class="info-table">
                <tr><td class="label">Mã bác sĩ:</td><td>${doctor.maBS}</td></tr>
                <tr><td class="label">CCCD:</td><td>${doctor.cccdBS}</td></tr>
                <tr><td class="label">Tên bác sĩ:</td><td>${doctor.tenBS}</td></tr>
                <tr><td class="label">Ngày sinh:</td><td>${doctor.ngaysinhBS}</td></tr>
                <tr><td class="label">Số điện thoại:</td><td>${doctor.sdtBS}</td></tr>
                <tr><td class="label">Email:</td><td>${doctor.emailBS}</td></tr>
                <tr><td class="label">Địa chỉ:</td><td>${doctor.diachiBS}</td></tr>
                <tr><td class="label">Số CCHN:</td><td>${doctor.soCCHN}</td></tr>
                <tr><td class="label">Nơi cấp CCHN:</td><td>${doctor.noicapCCHN}</td></tr>
                <tr><td class="label">Vai trò:</td><td>${doctor.vaiTro}</td></tr>
                <tr><td class="label">Tên đăng nhập:</td><td>${doctor.maBS}</td></tr>
                <tr><td class="label">Giới thiệu:</td><td>${doctor.gioithieu}</td></tr>
                <tr><td class="label">Mật khẩu mặc định:</td><td class="highlight">1</td></tr>
              </table>
              <p>Vui lòng đăng nhập và <span class="highlight">thay đổi mật khẩu</span> ngay sau khi đăng nhập lần đầu tiên.</p>
            </div>
            <div class="footer">
              <p>Trân trọng,<br>Phòng Khám</p>
              <p><a href="your-clinic-website">Liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      return {
        subject: 'Tài Khoản Bác Sĩ Đã Được Tạo',
        text: textContent,
        html: htmlContent,
      };
    }
  }
};
</script>

<style scoped>
@import "@/assets/addDoctor.css";
</style>