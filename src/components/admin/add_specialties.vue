<template>
    <div class="container">
      <h3 class="mb-4 text-center fw-bold">Thêm Chuyên Khoa</h3>
      <hr>
      <div class="card shadow-sm border-0 mt-5">
        <div class="card-body">
          <form id="specialtyForm" class="needs-validation" novalidate @submit.prevent="submitForm">
            <div class="row g-3">
              <!-- Mã chuyên khoa -->
              <div class="col-md-6">
                <label for="maCK" class="form-label fw-bold">Mã Chuyên Khoa <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  id="maCK"
                  v-model="form.maCK"
                  pattern="[A-Za-z0-9]{6,20}"
                  placeholder="Nhập mã chuyên khoa (6-20 ký tự)"
                  required
                />
                <div class="invalid-feedback">
                  Vui lòng nhập mã chuyên khoa hợp lệ (6-20 ký tự chữ và số).
                </div>
              </div>
              <!-- Tên chuyên khoa -->
              <div class="col-md-6">
                <label for="tenCK" class="form-label fw-bold">Tên Chuyên Khoa <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  id="tenCK"
                  v-model="form.tenCK"
                  maxlength="100"
                  placeholder="Nhập tên chuyên khoa"
                  required
                />
                <div class="invalid-feedback">
                  Vui lòng nhập tên chuyên khoa (tối đa 100 ký tự).
                </div>
              </div>
              <!-- Mô tả chuyên khoa -->
              <div class="col-12">
                <label for="mota" class="form-label fw-bold">Mô Tả Chuyên Khoa</label>
                <textarea
                  class="form-control"
                  id="mota"
                  v-model="form.mota"
                  rows="4"
                  maxlength="500"
                  placeholder="Nhập mô tả chuyên khoa (tối đa 500 ký tự)"
                ></textarea>
                <div class="invalid-feedback">
                  Mô tả chuyên khoa không được vượt quá 500 ký tự.
                </div>
              </div> 
            </div>
            <div class="text-center mt-4">
              <button type="submit" class="btn btn-primary">Thêm Chuyên Khoa</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import specialtiesService from '../../services/specialties.service';
  export default {
    data() {
      return {
        form: {
          maCK: '',
          tenCK: '',
          mota: ''
        }
      };
    },
    emits: ['formSubmitted'],
    methods: {
      async submitForm() {
        try{
          const form = document.getElementById('specialtyForm');
          if (form.checkValidity()) {
            try{
              await specialtiesService.create(this.form)
              alert('Thêm chuyên khoa thành công!');
            }catch (error){
              console.log('Lỗi khi thêm chuyên khoa:', this.form);
            }          
            // Reset form
            this.form = {
              maCK: '',
              tenCK: '',
              mota: ''
            };
            form.classList.remove('was-validated');
            this.$emit('formSubmitted'); // Emit sự kiện formSubmitted sau khi thêm thành công
          } else {
            form.classList.add('was-validated');
          }
        }catch(error){
          const errorMessage = error.response?.data?.message || 'Thêm chuyên khoa thất bại!';
          alert(errorMessage);
        }
        
      },
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/addSpecialties.css";
  </style>