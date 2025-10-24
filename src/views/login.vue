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

              <input type="button" class="fadeIn fourth btn btn-primary" @click="login" value="Login" :disabled="isLoggingIn">

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

import authService from "../services/login.service";

import { jwtDecode } from 'jwt-decode';

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

      isLoggingIn: false,  // ⚠️ MỚI: Prevent double login

      // ws: null,  // ⚠️ MỚI: WebSocket để sync login status

    };

  },

  mounted() {

    this.authStore.loadUser();

    this.refreshList();

  },

  methods: {

    async login() {
      if (this.isLoggingIn) return; 
      
      try {
        if (!this.userInput || !this.passInput) {
          alert("Vui lòng nhập tên đăng nhập và mật khẩu");
          return;
        }

        if (this.user.role !== 'benhnhan' && this.user.role !== 'bacsi') {
          alert("Vui lòng chọn vai trò");
          return;
        }

        this.isLoggingIn = true;

        const data = await authService.login({
          username: this.userInput,
          password: this.passInput,
          role: this.user.role
        });

        if (data.token) {
          // ⚠️ FIX: Validate token trước khi lưu (Giữ nguyên)
          try {
            const testDecode = jwtDecode(data.token);
            console.log('✅ Token decoded successfully:', testDecode);
          } catch (err) {
            console.error('❌ Invalid token received:', err);
            alert('Token không hợp lệ, vui lòng thử lại');
            this.isLoggingIn = false;
            return;
          }
          
          // Lưu JWT vào localStorage (Giữ nguyên)
          localStorage.setItem('JWT_TOKEN', data.token);
          
          // Set user vào authStore (Giữ nguyên)
          this.authStore.setUser(data.user, data.token);
          
          // ⚠️ XÓA BỎ DÒNG NÀY:
          // await this.syncLoginStatusAfterLogin(data.user, data.token);
          
          // ⚠️ SỬA LOGIC ĐIỀU HƯỚNG TẠI ĐÂY
          const routeName = data.user.role === 'patient' ? 'patient' : data.user.role;
          
          if (routeName === 'patient') {
            // 1. Dùng router để "resolve" (giải quyết)
            //    tên route ('patient') thành một đối tượng route hoàn chỉnh
            const resolvedRoute = this.router.resolve({ name: 'patient' });

            // 2. Lấy đường dẫn (href) từ route đã được giải quyết.
            //    Đây sẽ là đường dẫn chính xác (ví dụ: '/benh-nhan' hoặc '/patient-dashboard', v.v.)
            const targetPath = resolvedRoute.href;

            // 3. Gán đường dẫn chính xác này cho window.location.href
            //    để ép trình duyệt tải lại trang tại đúng URL.
            window.location.href = targetPath; 
          } else {
            // Các role khác (bác sĩ, admin) vẫn chuyển trang mượt
            this.router.replace({ name: routeName });
          }

        } else {
          alert(data.error || "Tên đăng nhập hoặc mật khẩu không đúng");
          this.isLoggingIn = false;
        }
      } catch (error) {
        console.error("Đăng nhập lỗi:", error);
        alert(error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại!");
        this.isLoggingIn = false;
        // (Giữ nguyên phần xử lý lỗi notfound)
        this.router.push({
          name: "notfound",
          params: { pathMatch: this.$route.path.split("/").slice(1) },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },



    // ⚠️ MỚI: Sync login status qua WebSocket sau khi login thành công

    // async syncLoginStatusAfterLogin(user, token) {

    //   return new Promise((resolve) => {

    //     const userId = user.maBN || user.id;

    //     if (!userId) {

    //       resolve();

    //       return;

    //     }



    //     // Connect WebSocket tạm thời để sync

    //     const tempWs = new WebSocket('ws://localhost:3000');

       

    //     tempWs.onopen = () => {

    //       console.log('✅ Login: Connected to WebSocket for sync');

         

    //       // Gửi init_patient với token mới

    //       tempWs.send(JSON.stringify({

    //         type: 'init_patient',

    //         patientId: userId,

    //         token: token

    //       }));



    //       // Đợi 500ms để đảm bảo message được xử lý

    //       setTimeout(() => {

    //         tempWs.close();

    //         console.log('✅ Login: Sync completed, WebSocket closed');

    //         resolve();

    //       }, 500);

    //     };



    //     tempWs.onerror = (error) => {

    //       console.error('❌ Login: WebSocket sync error:', error);

    //       tempWs.close();

    //       resolve();  // Vẫn resolve để không block login flow

    //     };



    //     // Timeout fallback nếu không connect được

    //     setTimeout(() => {

    //       if (tempWs.readyState !== WebSocket.CLOSED) {

    //         tempWs.close();

    //       }

    //       resolve();

    //     }, 2000);

    //   });

    // },



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



  // beforeUnmount() {

  //   // Cleanup WebSocket nếu có

  //   if (this.ws) {

  //     this.ws.close();

  //     this.ws = null;

  //   }

  // }

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

