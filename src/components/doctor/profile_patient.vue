<template>
    <div class="container-xl px-4 mt-4">
      <hr class="mt-0 mb-4">
      <div class="row">
        <div class="col-xl-4">
          <!-- Profile picture card-->
          <div class="card mb-4 mb-xl-0">
            <div class="card-header">Profile Picture</div>
            <div class="card-body text-center">
              <img class="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="">
              <div class="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
              <button class="btn btn-primary" type="button">Upload new image</button>
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <!-- Account details card-->
          <div class="card mb-4">
            <div class="card-header">Account Details</div>
            <div class="card-body">
              <form @submit.prevent="create_patient">
                <div class="row gx-3 mb-3">
                  <div class="col-md-6">
                    <label class="small mb-1" for="Name">Họ tên bệnh nhân:</label>
                    <input class="form-control" id="Name" type="text" placeholder="Họ và tên" v-model="patient.hotenBN" required>
                  </div>
                  <div class="col-md-6">
                    <label class="small mb-1" for="cccd">Số CCCD:</label>
                    <input class="form-control" id="cccd" type="text" placeholder="CCCD" v-model="patient.cccdBN" required>
                  </div>
                </div>
                <div class="row gx-3 mb-3">
                  <div class="col-md-6">
                    <label class="small mb-1" for="born">Ngày sinh:</label>
                    <input class="form-control" id="born" type="date" v-model="patient.ngaysinhBN" required>
                  </div>
                  <div class="col-md-6">
                    <label class="small mb-1" for="phone">Số điện thoại:</label>
                    <input class="form-control" id="phone" type="text" placeholder="09*/03*..." v-model="patient.sdtBN" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="small mb-1" for="bhyt">Số BHYT:</label>
                  <input class="form-control" id="bhyt" type="text" placeholder="Số BHYT" v-model="patient.soBHYT">
                </div>
                <div class="mb-3">
                  <label class="small mb-1" for="Address">Địa chỉ:</label>
                  <input class="form-control" id="Address" placeholder="Địa chỉ" v-model="patient.diachiBN" required>
                </div>
                <div class="mb-3">
                  <label class="small mb-1" for="Email">Email:</label>
                  <input class="form-control" id="Email" type="email" placeholder="name@example.com" v-model="patient.emailBN">
                </div>
                <div class="row gx-3 mb-3">
                  <div class="col-md-2">
                    <label class="small mb-1" for="height">Chiều cao (cm):</label>
                    <input class="form-control" id="height" type="number" placeholder="cm" v-model="patient.chieucao">
                  </div>
                  <div class="col-md-2">
                    <label class="small mb-1" for="weight">Cân nặng (kg):</label>
                    <input class="form-control" id="weight" type="number" placeholder="kg" v-model="patient.cannang">
                  </div>
                  <div class="col-md-2">
                    <label class="small mb-1" for="type">Nhóm máu:</label>
                    <input class="form-control" id="type" type="text" placeholder="" v-model="patient.nhommau">
                  </div>
                </div>
                <!-- <button class="btn btn-primary" type="button" @click="create_patient">Save changes</button> -->
                <button class="btn btn-warning mx-3" type="button" :disabled="!isFormValid" @click="create_patient">Lưu và Khám bệnh</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import patientService from '../../services/patient.service';
  
  export default {
    emits: ['examination:patient', 'push:patient'],
    data() {
      return {
        status: '',
        patient: {
          emailBN: '',
          cccdBN: '',
          soBHYT: '',
          hotenBN: '',
          sdtBN: '',
          ngaysinhBN: '',
          diachiBN: '',
          chieucao: null,
          cannang: null,
          nhommau: '',
        },
      };
    },
    computed: {
      isFormValid() {
        return (
          this.patient.hotenBN &&
          this.patient.cccdBN &&
          this.patient.ngaysinhBN &&
          this.patient.sdtBN &&
          this.patient.diachiBN
        );
      },
    },
    methods: {
      examination() {
        if (!this.isFormValid) {
          alert('Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, CCCD, Ngày sinh, Số điện thoại, Địa chỉ)!');
          return;
        }
        this.$emit('examination:patient', 'examination');
        this.$emit('push:patient', this.patient);
      },
      async create_patient() {
        try {
          if (!this.isFormValid) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, CCCD, Ngày sinh, Số điện thoại, Địa chỉ)!');
            return;
          }
          await patientService.create(this.patient);
          alert('Thêm bệnh nhân thành công!');
          this.examination()
          this.resetForm();
        } catch (error) {
          alert('Thêm bệnh nhân không thành công!');
          console.log('Lỗi khi thêm bệnh nhân:', error);
        }
      },
      resetForm() {
        this.patient = {
          emailBN: '',
          cccdBN: '',
          soBHYT: '',
          hotenBN: '',
          sdtBN: '',
          ngaysinhBN: '',
          diachiBN: '',
          chieucao: null,
          cannang: null,
          nhommau: '',
        };
      },
    },
  };
  </script>
  
  <style scoped>
  body {
    margin-top: 20px;
    background-color: #f2f6fc;
    color: #69707a;
  }
  .img-account-profile {
    height: 10rem;
  }
  .rounded-circle {
    border-radius: 50% !important;
  }
  .card {
    box-shadow: 0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%);
  }
  .card .card-header {
    font-weight: 500;
  }
  .card-header:first-child {
    border-radius: 0.35rem 0.35rem 0 0;
  }
  .card-header {
    padding: 1rem 1.35rem;
    margin-bottom: 0;
    background-color: rgba(33, 40, 50, 0.03);
    border-bottom: 1px solid rgba(33, 40, 50, 0.125);
  }
  .form-control,
  .dataTable-input {
    display: block;
    width: 100%;
    padding: 0.875rem 1.125rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1;
    color: #69707a;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #c5ccd6;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0.35rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .btn-warning:disabled {
    background-color: #e0a800;
    opacity: 0.65;
    cursor: not-allowed;
  }
  </style>