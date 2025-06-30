<template>
  <section class="page" style="background-image: url('https://mdbootstrap.com/img/Photos/Others/sidenav2.jpg');background-size: cover;">
<div class="container py-5 h-100">
  <div class="row d-flex justify-content-center align-items-center h-100">
      <p class="mb-0 fw-bold fs-1 text-center"
          style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
          Đăng ký
      </p>
      <p class="mb-0 fw-bold fs-5 text-center"
          style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
          "Hoàn thành biểu mẫu để đăng ký tài khoản"
      </p>
    <div class="col-10">
      <div class="card card-registration card-registration-2" style="border-radius: 15px;">
        <div class="card-body p-0">        
          <div class="row g-0">                
            <div class="col-lg-6">            
              <div class="p-5">                    
                <h3 class="fw-normal mb-5" style="color: #1f4978cb;"><strong>Thông tin tài khoản</strong></h3>

                <div class="mb-4 pb-2">
                  <label class="form-label" for="form3Examplev2">Tên đăng nhập</label>
                  <small v-if="errors.tendangnhapBN" class="text-danger">{{ errors.tendangnhapBN }}</small>
                  <input type="text" id="form3Examplev2" class="form-control form-control-lg" 
                  v-model="user.tendangnhapBN" @input="validateUsername"/>
                </div>

                <div class="mb-4 pb-2">
                  <label class="form-label" for="form3Examplev3">Email</label>
                  <small v-if="errors.emailBN" class="text-danger">{{ errors.emailBN }}</small>
                  <input type="text" id="form3Examplev3" class="form-control form-control-lg" 
                  v-model="user.emailBN" @input="validateEmail"/>
                </div>

                <div class="mb-4 pb-2">
                  <label class="form-label" for="form3Examplev4">CCCD</label>
                  <small v-if="errors.cccdBN" class="text-danger">{{ errors.cccdBN }}</small>
                  <input type="text" id="form3Examplev4" class="form-control form-control-lg" 
                  v-model="user.cccdBN" @input="validateCCCD"/>
                </div>

                <div class="mb-4 pb-3">
                  <label class="form-label" for="form3Examplev5">Tạo mật khẩu</label>
                  <small v-if="errors.matkhauBN" class="text-danger">{{ errors.matkhauBN }}</small>
                  <input type="password" id="form3Examplev5" class="form-control form-control-lg" 
                  v-model="user.matkhauBN" @input="validatePassword"/>
                </div>

                <div class="mb-4 pb-2">
                  <label class="form-label" for="form3Examplev6">Nhập lại mật khẩu</label>
                  <small v-if="errors.confirmMatkhauBN" class="text-danger">{{ errors.confirmMatkhauBN }}</small>
                  <input type="password" id="form3Examplev6" class="form-control form-control-lg" 
                  v-model="confirmMatkhauBN" @input="validateConfirmPassword"/>
                </div>

                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="hasVisited" id="checkDefault">
                  <label class="form-check-label" for="checkDefault">
                    <a class="underlineHover">Tôi đã từng khám ở đây!</a>
                  </label>
                </div>

              </div>
            </div>
            <div class="col-lg-6 bg-indigo text-white">
              <div class="p-5">
                <h3 class="fw-normal mb-5"><strong>Thông tin cá nhân</strong></h3>
                <div class="mb-4 pb-2">
                  <div data-mdb-input-init class="form-outline form-white">
                      <label class="form-label" for="form3Examplea2">Họ và tên</label>
                      <small v-if="errors.hotenBN" class="text-danger">{{ errors.hotenBN }}</small>
                      <input type="text" id="form3Examplea2" class="form-control form-control-lg" :disabled="hasVisited" 
                      v-model="user.hotenBN" @input="validateName"/>            
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea4">Ngày sinh</label>
                        <small v-if="errors.ngaysinhBN" class="text-danger">{{ errors.ngaysinhBN }}</small>
                        <input type="date" id="form3Examplea4" class="form-control form-control-lg" :disabled="hasVisited" 
                        v-model="user.ngaysinhBN" @input="validateDate"/>            
                    </div>
                  </div>

                  <div class="col-md-6 mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea4">Số BHYT</label>
                        <small v-if="errors.soBHYT" class="text-danger">{{ errors.soBHYT }}</small>
                        <input type="text" id="form3Examplea4" class="form-control form-control-lg" :disabled="hasVisited" 
                        v-model="user.soBHYT" @input="validateBHYT"/>            
                    </div>
                  </div>
                </div>

                <div class="mb-4 pb-2">
                  <div data-mdb-input-init class="form-outline form-white">
                      <label class="form-label" for="form3Examplea5">Địa chỉ</label>
                      <small v-if="errors.diachiBN" class="text-danger">{{ errors.diachiBN }}</small>
                    <input type="text" id="form3Examplea5" class="form-control form-control-lg" :disabled="hasVisited" 
                    v-model="user.diachiBN" @input="validateAddress"/>
                  </div>
                </div>

                <div class="mb-4 pb-2">
                  <div data-mdb-input-init class="form-outline form-white">
                      <label class="form-label" for="form3Examplea6">Số điện thoại</label>
                      <small v-if="errors.sdtBN" class="text-danger">{{ errors.sdtBN }}</small>
                    <input type="text" id="form3Examplea6" class="form-control form-control-lg" :disabled="hasVisited" 
                    v-model="user.sdtBN" @input="validatePhone"/>                      
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                      <label class="form-label" for="form3Examplea7">Chiều cao</label>
                      <small v-if="errors.chieucao" class="text-danger">{{ errors.chieucao }}</small>
                      <input type="text" id="form3Examplea7" class="form-control form-control-lg" :disabled="hasVisited" 
                      v-model="user.chieucao" @input="validateHeight"/>                        
                    </div>
                  </div>
                  <div class="col-md-4 mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                      <label class="form-label" for="form3Examplea8">Cân nặng</label>
                      <small v-if="errors.cannang" class="text-danger">{{ errors.cannang }}</small>
                      <input type="text" id="form3Examplea8" class="form-control form-control-lg" :disabled="hasVisited" 
                      v-model="user.cannang" @input="validateWeight"/>                        
                    </div>
                  </div>
                  <div class="col-md-4 mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                      <label class="form-label" for="form3Examplea9">Nhóm máu</label>
                      <small v-if="errors.nhommau" class="text-danger">{{ errors.nhommau }}</small>
                      <select id="form3Examplea9" class="form-control form-control-lg" :disabled="hasVisited" 
                      v-model="user.nhommau" @change="validateBloodGroup">
                        <option value="" disabled selected>Chọn nhóm máu</option>
                        <option v-for="blood in bloodGroups" :key="blood" :value="blood">{{ blood }}</option>
                      </select>                        
                    </div>
                  </div>
                </div>

                <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-light btn-lg me-3"
                  data-mdb-ripple-color="dark" @click="create_user" :disabled="!isFormValid">Đăng kí</button>
                <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-warning btn-lg"
                  data-mdb-ripple-color="dark" @click="tologin">Đi đến đăng nhập</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import patientService from '../services/patient.service'
import bcrypt from 'bcryptjs';
export default {    
  data() {
    return {
      router: useRouter(),
      authStore: useAuthStore(),
      hasVisited: false,
      confirmMatkhauBN: '',
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      user: {
        hotenBN: '',
        cccdBN: '',
        ngaysinhBN: '',
        diachiBN: '',
        sdtBN: '',
        chieucao: null,
        cannang: null,
        nhommau: '',
        tendangnhapBN: '',
        emailBN: '',
        matkhauBN: '',
        soBHYT: ''
      },
      errors: {
        hotenBN: '',
        cccdBN: '',
        ngaysinhBN: '',
        diachiBN: '',
        sdtBN: '',
        chieucao: '',
        cannang: '',
        nhommau: '',
        tendangnhapBN: '',
        emailBN: '',
        matkhauBN: '',
        confirmMatkhauBN: '',
        soBHYT: ''
      }
    };
  },

  computed: {
    isFormValid() {
      return Object.values(this.errors).every(error => !error) && 
             Object.values(this.user).every(value => value !== '' && value !== null) &&
             this.confirmMatkhauBN !== '';
    }
  },

  methods: {
    tologin(){
      this.$router.push({
          name: "loginform",
          query: this.$route.query,
          hash: this.$route.hash,
      });
    },

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    },

    convertToUTCPlus7(utcDateString) {
      const utcDate = new Date(utcDateString);
      if (isNaN(utcDate)) {
        throw new Error('Invalid date string');
      }
      const utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
      const year = utcPlus7Date.getUTCFullYear();
      const month = String(utcPlus7Date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(utcPlus7Date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    validateUsername() {
      const username = this.user.tendangnhapBN;
      this.errors.tendangnhapBN = username.length < 3 ? 'Tên đăng nhập phải từ 3 ký tự trở lên' : '';
    },

    validateEmail() {
      const email = this.user.emailBN;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors.emailBN = email && !emailRegex.test(email) ? 'Email không hợp lệ' : '';
    },

    validateCCCD() {
      const cccd = this.user.cccdBN;
      const cccdRegex = /^\d{12}$/;
      this.errors.cccdBN = cccd && !cccdRegex.test(cccd) ? 'CCCD phải là 12 số' : '';
    },

    validatePassword() {
      const password = this.user.matkhauBN;
      this.errors.matkhauBN = password.length < 6 ? 'Mật khẩu phải từ 6 ký tự trở lên' : '';
      this.validateConfirmPassword();
    },

    validateConfirmPassword() {
      const confirm = this.confirmMatkhauBN;
      this.errors.confirmMatkhauBN = confirm !== this.user.matkhauBN ? 'Mật khẩu nhập lại không khớp' : '';
    },

    validateName() {
      const name = this.user.hotenBN;
      this.errors.hotenBN = name && name.length < 2 ? 'Họ tên phải từ 2 ký tự trở lên' : '';
    },

    validateDate() {
      const date = this.user.ngaysinhBN;
      const today = new Date();
      const inputDate = new Date(date);
      this.errors.ngaysinhBN = date && (isNaN(inputDate) || inputDate > today) ? 'Ngày sinh không hợp lệ' : '';
    },

    validateBHYT() {
      const bhyt = this.user.soBHYT;
      const bhytRegex = /^[A-Z]{2}\d{13}$/;
      this.errors.soBHYT = bhyt && !bhytRegex.test(bhyt) ? 'Số BHYT không hợp lệ (2 chữ + 13 số)' : '';
    },

    validateAddress() {
      const address = this.user.diachiBN;
      this.errors.diachiBN = address && address.length < 5 ? 'Địa chỉ phải từ 5 ký tự trở lên' : '';
    },

    validatePhone() {
      const phone = this.user.sdtBN;
      const phoneRegex = /^\d{10}$/;
      this.errors.sdtBN = phone && !phoneRegex.test(phone) ? 'Số điện thoại phải là 10 số' : '';
    },

    validateHeight() {
      const height = this.user.chieucao;
      this.errors.chieucao = height && (isNaN(height) || height < 50 || height > 250) ? 'Chiều cao phải từ 50-250 cm' : '';
    },

    validateWeight() {
      const weight = this.user.cannang;
      this.errors.cannang = weight && (isNaN(weight) || weight < 20 || weight > 200) ? 'Cân nặng phải từ 20-200 kg' : '';
    },

    validateBloodGroup() {
      const blood = this.user.nhommau;
      this.errors.nhommau = blood && !this.bloodGroups.includes(blood) ? 'Vui lòng chọn nhóm máu hợp lệ' : '';
    },

    async create_user(){
      try {
        let list = await patientService.get_cccd(this.user.cccdBN)
        let check = list[0]
        let tendangnhapBN = await patientService.get_acname(this.user.tendangnhapBN)
        if(tendangnhapBN.length !== 0){
          alert("Tên đăng nhập đã tồn tại!")   
          this.clear_value()     
          return;  
        }

        if(list.length !== 0 && check.tendangnhapBN){
          alert("Bạn đã tạo tài khoản rồi!")   
          this.clear_value()     
          return;  
        }

        if(list.length !== 0 && this.hasVisited === false){
          alert(`Từng đến đây khám rồi. Vui lòng chọn vào ô "Tôi đã từng khám ở đây!"`)    
          this.clear_value()     
          return;     
        }

        if(list.length === 0 && this.hasVisited === true){
          alert(`Bạn chưa có tài khoản và chưa từng đến khám ở đây. Vui lòng bỏ chọn ô "Tôi đã từng khám ở đây!"`)    
          this.clear_value()     
          return;     
        }

        if (!this.isFormValid) {
          alert("Vui lòng kiểm tra lại các trường thông tin!");
          return;
        }

        if(list.length === 0){
          this.user.matkhauBN = await this.hashPassword(this.user.matkhauBN);
          await patientService.create(this.user);
          alert(`Tài khoản được tạo thành công!`);
          this.clear_value();
          this.tologin();
          return;
        }

        if(list.length !== 0){
          let temp = {
            hotenBN: check.hotenBN,
            cccdBN: check.cccdBN,
            ngaysinhBN: this.convertToUTCPlus7(check.ngaysinhBN),
            diachiBN: check.diachiBN,
            sdtBN: check.sdtBN,
            chieucao: check.chieucao,
            cannang: check.cannang,
            nhommau: check.nhommau,
            tendangnhapBN: this.user.tendangnhapBN,
            emailBN: check.emailBN,
            matkhauBN: await this.hashPassword(this.user.matkhauBN),
            soBHYT: this.user.soBHYT
          };
          await patientService.update(check.maBN, temp);
          alert(`Tài khoản được tạo thành công!`);
          this.clear_value();
          this.tologin();
          return;
        }

      } catch (error){
        alert("Đăng ký không thành công");
        console.log("Có lỗi khi đăng ký bệnh nhân:", error);
      }
    },

    clear_value(){
      this.user = {
        hotenBN: '',
        cccdBN: '',
        ngaysinhBN: '',
        diachiBN: '',
        sdtBN: '',
        chieucao: null,
        cannang: null,
        nhommau: '',
        tendangnhapBN: '',
        emailBN: '',
        matkhauBN: '',
        soBHYT: ''
      };
      this.confirmMatkhauBN = '';
      this.errors = {
        hotenBN: '',
        cccdBN: '',
        ngaysinhBN: '',
        diachiBN: '',
        sdtBN: '',
        chieucao: '',
        cannang: '',
        nhommau: '',
        tendangnhapBN: '',
        emailBN: '',
        matkhauBN: '',
        confirmMatkhauBN: '',
        soBHYT: ''
      };
    }
  },
};
</script>

<style scoped>
  @import "@/assets/register.css";
  .page {
      text-align: center;
      max-width: 1200px;
      margin: 0 auto;
  }
  .text-danger {
      font-size: 0.8rem;
      display: block;
      margin-bottom: 5px;
  }
</style>