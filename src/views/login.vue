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
import authService from "../services/login.service";  // Import AuthService

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

        if (this.user.role !== 'benhnhan' && this.user.role !== 'bacsi') {
          alert("Vui lòng chọn vai trò");
          return;
        }

        // Gọi AuthService
        const data = await authService.login({
          username: this.userInput,
          password: this.passInput,
          role: this.user.role
        });

        if (data.token) {
          // Lưu JWT vào localStorage
          localStorage.setItem('JWT_TOKEN', data.token);
          
          // Set user vào authStore
          this.authStore.setUser(data.user);
          
          // Chuyển route dựa trên role
          const routeName = data.user.role === 'patient' ? 'patient' : data.user.role;
          this.router.replace({ name: routeName });
        } else {
          alert(data.error || "Tên đăng nhập hoặc mật khẩu không đúng");
        }
      } catch (error) {
        console.error("Đăng nhập lỗi:", error);
        alert(error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại!");
        this.router.push({
          name: "notfound",
          params: { pathMatch: this.$route.path.split("/").slice(1) },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },

    async forgotPassword() {
      try {
        if (!this.userInput || !this.emailInput) {
          alert("Vui lòng nhập tên đăng nhập và email");
          return;
        }

        if (this.user.role !== 'benhnhan' && this.user.role !== 'bacsi') {
          alert("Vui lòng chọn vai trò");
          return;
        }

        // Gọi AuthService
        const data = await authService.forgotPassword({
          username: this.userInput,
          email: this.emailInput,
          role: this.user.role
        });

        alert(data.message);
        this.showForgotPassword = false;
        this.refreshList();
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
        alert(error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại sau!");
      }
    },

    async submitCode() {
      if (!this.codeInput) {
        alert("Vui lòng nhập mã xác nhận");
        return;
      }

      // Tùy chọn: Gọi API verify code nếu backend có endpoint
      // Ví dụ: const verifyData = await authService.verifyCode({ code: this.codeInput, username: this.userInput, role: this.user.role });
      // Nhưng vì backend hiện tại chỉ gửi code qua email, user có thể login trực tiếp với code mới
      alert("Mã xác nhận thành công! Bạn có thể đăng nhập với mật khẩu mới.");
      this.showForgotPassword = false;
      this.showCodeInput = false;
      this.refreshList();
    },

    refreshList() {
      this.userInput = '';
      this.passInput = '';
      this.emailInput = '';
      this.codeInput = '';
    },
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