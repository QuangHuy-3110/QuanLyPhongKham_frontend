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
          tenCK: ''
        }
      };
    },
    emits: ['formSubmitted'],
    methods: {
      async submitForm() {
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
            tenCK: ''
          };
          form.classList.remove('was-validated');
          this.$emit('formSubmitted'); // Emit sự kiện formSubmitted sau khi thêm thành công
        } else {
          form.classList.add('was-validated');
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
  
  .invalid-feedback {
    font-size: 0.875rem;
  }
  
  input:focus {
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    border-color: #007bff;
  }
  
  @media (max-width: 768px) {
    .container {
      margin: 1rem;
    }
  
    .card-body {
      padding: 1rem;
    }
  
    .btn-primary {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  
    .form-label {
      font-size: 0.9rem;
    }
  
    input {
      font-size: 0.9rem;
    }
  
    .invalid-feedback {
      font-size: 0.8rem;
    }
  }
  </style>