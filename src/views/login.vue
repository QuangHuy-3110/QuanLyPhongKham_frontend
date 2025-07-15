<template>
  <div class="page">
    <div id="body" style="background-image: url('https://mdbootstrap.com/img/Photos/Others/sidenav2.jpg'); background-size: cover;">
      <div class="wrapper fadeInDown d-flex align-items-center justify-content-center min-vh-100">
        <div id="formContent" class="d-flex flex-column align-items-center">
          <h2 class="text-center">Chào mừng bạn đến với phòng khám</h2>
          <div class="fadeIn first">
            <img v-if="!showForgotPassword" src="https://static.vecteezy.com/system/resources/previews/041/731/156/non_2x/login-icon-vector.jpg" id="icon" alt="User Icon" />
            <img v-if="showForgotPassword" src="https://media.istockphoto.com/id/1500914761/es/vector/fitness-salud-gimnasio-iconos-de-moda-en-c%C3%ADrculos.jpg?s=612x612&w=0&k=20&c=enBppjqLpxjF2Gda8_8WIejrJdj8xREZ3FFOdNCHn4w=" id="icon" alt="User Icon" />

          </div>
          <div class="row w-100 justify-content-center pb-3">
            <div class="d-flex align-items-center justify-content-center">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value="benhnhan" v-model="user.role" checked>
                <label class="form-check-label" for="radioDefault1">Bạn là bệnh nhân</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2" value="bacsi" v-model="user.role">
                <label class="form-check-label" for="radioDefault2">Bạn là bác sĩ</label>
              </div>
            </div>
          </div>
          <div v-if="!showForgotPassword">
            <form @keydown.enter="login" class="w-100 d-flex flex-column align-items-center">
              <input type="text" id="login" class="fadeIn second form-control mb-3" name="login" placeholder="login" v-model="userInput">
              <input type="password" id="password" class="fadeIn third form-control mb-3" name="login" placeholder="password" v-model="passInput">
              <input type="button" class="fadeIn fourth btn btn-primary" @click="login" value="Login">
            </form>
            <div class="mt-3">
              <a href="#" @click="showForgotPassword = true" style="font-family: 'Poppins', sans-serif;">Quên mật khẩu?</a>
            </div>
          </div>
          <div v-else>
            <form @keydown.enter="forgotPassword" class="w-100 d-flex flex-column align-items-center">
              <h3 class="text-center fw-bold">Quên mật khẩu</h3>
              <div>
                <input type="text" id="forgotLogin" class="fadeIn second form-control mb-3" name="forgotLogin" placeholder="Tên đăng nhập" v-model="userInput">
                <input type="email" id="email" class="fadeIn third form-control mb-3" name="email" placeholder="Email" v-model="emailInput">
                <input type="button" class="fadeIn fourth btn btn-primary" @click="forgotPassword" value="Gửi">
              </div>
              <a href="#" class="mt-3" @click="showForgotPassword = false; showCodeInput = false">Quay lại đăng nhập</a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import patientService from "../services/patient.service";
import doctorService from "../services/doctor.service";
import emailService from '../services/email.service';
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      message: "",
      router: useRouter(),
      authStore: useAuthStore(),
      passInput: '',
      userInput: '',
      emailInput: '',
      codeInput: '',
      user: {
        role: 'benhnhan'
      },
      showForgotPassword: false,
      showCodeInput: false,
      code: '',
    };
  },
  mounted() {
    this.authStore.loadUser();
    this.refreshList();
  },
  methods: {
    async login() {
      try {
        if (!this.userInput || !this.passInput) {
          alert("Vui lòng nhập tên đăng nhập và mật khẩu");
          return;
        }

        if (this.user.role === 'benhnhan') {
          const patient = await patientService.get_acname(this.userInput);
          if (!patient || patient.length === 0) {
            alert("Tên đăng nhập không tồn tại");
            return;
          }
          const isMatch = await bcrypt.compare(this.passInput, patient[0].matkhauBN);
          if (isMatch) {
            this.authStore.setUser({ id: patient[0].maBN, role: 'benhnhan' });
            this.router.replace({ name: "patient" });
          } else {
            alert("Tên đăng nhập hoặc mật khẩu không đúng");
          }
        } else if (this.user.role === 'bacsi') {
          const doctor = await doctorService.get(this.userInput);
          
          if (!doctor || doctor.length === 0) {
            alert("Tên đăng nhập không tồn tại");
            return;
          }
          const isMatch = await bcrypt.compare(this.passInput, doctor.matkhau);
          console.log(isMatch)
          if (isMatch) {
            const role = doctor.vaiTro === "DOCTOR" ? 'doctor' : 'admin';
            this.authStore.setUser({ id: doctor.maBS, role });
            this.router.replace({ name: role });
          } else {
            alert("Tên đăng nhập hoặc mật khẩu không đúng");
          }
        } else {
          alert("Vui lòng chọn vai trò");
        }
      } catch (error) {
        console.error("Đăng nhập lỗi:", error);
        this.router.push({
          name: "notfound",
          params: { pathMatch: this.$route.path.split("/").slice(1) },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },

    generateRandomCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      // this.code = code; // Gán vào this.code
      return code;
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

    async forgotPassword() {
      try {
        if (!this.userInput || !this.emailInput) {
          alert("Vui lòng nhập tên đăng nhập và email");
          return;
        }
        if (this.user.role === 'benhnhan') {
          let patient = await patientService.get_acname(this.userInput);
          if (!patient || patient.length === 0) {
            alert("Tên đăng nhập không tồn tại");
            return;
          }
          if (patient[0].emailBN !== this.emailInput) {
            alert("Email không khớp với tên đăng nhập");
            return;
          }
          alert("Mật khẩu đã được gửi đến email của bạn! Vui lòng kiểm tra email để đăng nhập.");

          this.code = this.generateRandomCode()
          patient[0].ngaysinhBN = this.parseDateForBackend(patient[0].ngaysinhBN)
          patient[0].matkhauBN = await this.hashPassword(this.code)
          await patientService.update(patient[0].maBN, patient[0])

          const content = this.generatePasswordResetEmailContent(patient[0].emailBN, patient[0].hotenBN);
          await emailService.sendEmail(patient[0].emailBN, content);

          this.showForgotPassword = false;
        } else if (this.user.role === 'bacsi') {
          let doctor = await doctorService.get(this.userInput);
          if (!doctor || doctor.length === 0) {
            alert("Tên đăng nhập không tồn tại");
            return;
          }
          if (doctor[0].emailBS !== this.emailInput) {
            alert("Email không khớp với tên đăng nhập");
            return;
          }

          alert("Mật khẩu đã được gửi đến email của bạn! Vui lòng kiểm tra email để đăng nhập.");
          
          this.code = this.generateRandomCode()
          doctor[0].ngaysinhBS = this.parseDateForBackend(doctor[0].ngaysinhBS)
          doctor[0].matkhau = await this.hashPassword(this.code)
          await patientService.update(doctor[0].maBS, doctor[0])

          const content = this.generatePasswordResetEmailContent(doctor[0].emailBS, doctor[0].tenBS);
          await emailService.sendEmail(doctor[0].emailBS, content);

          this.showForgotPassword = false;
        } else {
          alert("Vui lòng chọn vai trò");
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
      }
    },

    async submitCode() {
        if (!this.codeInput) {
          alert("Vui lòng nhập mã đăng nhập");
          return;
        }

        if (this.codeInput !== this.code) {
          alert("Mã đăng nhập không đúng, vui lòng thử lại!");
          return;
        }
        try {

        // this.showForgotPassword = false;
        // this.showCodeInput = false;
        this.refreshList();
      } catch (error) {
        console.error("Lỗi khi xác nhận mã:", error);
        alert("Mã không hợp lệ, vui lòng thử lại!");
        this.router.push({
          name: "notfound",
          params: { pathMatch: this.$route.path.split("/").slice(1) },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    refreshList() {
      this.userInput = '';
      this.passInput = '';
      this.emailInput = '';
      this.codeInput = '';
    },

    generatePasswordResetEmailContent (email, username) {
      const textContent = `Kính gửi ${username || 'Quý khách'},

      Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Mật khẩu mới của bạn là:

      Mật khẩu mới: ${this.code}

      Vui lòng sử dụng mật khẩu này để đăng nhập và đổi lại mật khẩu nếu cần. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với chúng tôi ngay lập tức.

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
            .password { display: inline-block; background-color: #f8f9fa; padding: 10px 20px; font-size: 24px; font-weight: bold; letter-spacing: 2px; border: 1px solid #e0e0e0; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666; }
            .footer p { margin: 0; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Đặt Lại Mật Khẩu</h1>
            </div>
            <div class="content">
              <p>Kính gửi ${username || 'Quý khách'},</p>
              <p>Bạn đã yêu cầu đặt lại mật khẩu. Mật khẩu mới của bạn là:</p>
              <div class="password">${this.code}</div>
              <p>Vui lòng sử dụng mật khẩu này để đăng nhập và đổi lại mật khẩu nếu cần. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
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
        subject: 'Mật Khẩu Mới Cho Tài Khoản Của Bạn',
        text: textContent,
        html: htmlContent,
      };
    }
  },
};
</script>

<style scoped>
@import "@/assets/loginform.css";
.page {
  text-align: center;
  max-width: 750px;
  margin: 0 auto;
}
</style>