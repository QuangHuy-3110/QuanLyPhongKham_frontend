<template>
  <div class="page">
    <div id="body" style="background-image: url('https://mdbootstrap.com/img/Photos/Others/sidenav2.jpg'); background-size: cover;">
      <div class="wrapper fadeInDown d-flex align-items-center justify-content-center min-vh-100">
        <div id="formContent" class="d-flex flex-column align-items-center">
          <h2 class="text-center">Chào mừng bạn đến với phòng khám</h2>
          <div class="fadeIn first">
            <img src="https://static.vecteezy.com/system/resources/previews/041/731/156/non_2x/login-icon-vector.jpg" id="icon" alt="User Icon" />
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
          <form @keydown.enter="login" class="w-100 d-flex flex-column align-items-center">
            <input type="text" id="login" class="fadeIn second form-control mb-3" name="login" placeholder="login" v-model="userInput">
            <input type="password" id="password" class="fadeIn third form-control mb-3" name="login" placeholder="password" v-model="passInput">
            <input type="button" class="fadeIn fourth btn btn-primary" @click="login" value="Login">
          </form>
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
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      message: "",
      router: useRouter(),
      authStore: useAuthStore(),
      passInput: '',
      userInput: '',
      user: {
        role: 'benhnhan'
      }
    };
  },
  mounted() {
    this.authStore.loadUser(); // Khôi phục trạng thái người dùng từ sessionStorage
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
    refreshList() {
      this.userInput = '';
      this.passInput = '';
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