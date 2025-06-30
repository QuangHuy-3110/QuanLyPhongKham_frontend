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
                  <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value="benhnhan" v-model="user.role">
                  <label class="form-check-label" for="radioDefault1">Bạn là bệnh nhân</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2" value="bacsi" v-model="user.role" checked>
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
                 server: null,
                 message: "",
                 router: useRouter(),
                 authStore: useAuthStore(),
                 passInput: '',
                 userInput: '',
                 user: {
                    role: 'bacsi'
                }
             };
         },
 
     // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
      
         methods: {
 
             async login() {
                 try {
                     if (this.user.role !== 'bacsi'){
                        const patient = await patientService.get_acname(this.userInput);
                         const isMatch = await bcrypt.compare(this.passInput, patient[0].matkhauBN);
                         if( isMatch){
                             this.authStore.setUser({ id: patient[0].maBN});
                             sessionStorage.setItem("userId", patient[0].maBN);
                             this.router.replace({ name: "patient" });
                         } else{
                             alert("Tên đăng nhập hoặc mật khẩu không đúng")
                         }                           
                             // this.$router.push({ name: "docgia", query: { id: docgia[0]._id } });
 
                     }else if(this.user.role === 'bacsi'){
                        const doctor = await doctorService.get(this.userInput);
                         const isMatch = await bcrypt.compare(this.passInput, doctor[0].matkhau);
                         if( isMatch ){
                             this.authStore.setUser({ id: doctor[0].maBS});
                             sessionStorage.setItem("userId", doctor[0].maBS);
                             this.router.replace({ name: "doctor" });
                         }     
                         else{
                             alert("Tên đăng nhập hoặc mật khẩu không đúng")
                         }                         
                             // this.$router.push({ name: "nhanvien", query: { id: nhanvien[0]._id } });
                     }else {
                         alert("Sai tên đăng nhập hoặc mật khẩu")
                     }
                 } catch (error) {
                     console.log(error);
                     // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                     this.$router.push({
                         name: "notfound",
                         params: {
                         pathMatch: this.$route.path.split("/").slice(1)
                         },
                         query: this.$route.query,
                         hash: this.$route.hash,
                     });
                 }
                 
             },
             refreshList() {
                 this.userInput = "",  
                 this.userPass = ""
             },
         },
         mounted() {
             this.refreshList();
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