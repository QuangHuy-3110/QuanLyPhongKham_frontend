
<template >
    <section class="h-100 h-custom gradient-custom-2">
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
                    <input type="text" id="form3Examplev2" class="form-control form-control-lg" />
                  </div>

                  <div class="mb-4 pb-2">
                    <label class="form-label" for="form3Examplev2">Email</label>
                    <input type="text" id="form3Examplev2" class="form-control form-control-lg" />
                  </div>


                  <div class="mb-4 pb-3">
                    <label class="form-label" for="form3Examplev2">Tạo mật khẩu</label>
                    <input type="text" id="form3Examplev2" class="form-control form-control-lg" />
                  </div>


                  <div class="mb-4 pb-2">
                    <label class="form-label" for="form3Examplev2">Nhập lại mật khẩu</label>
                    <input type="text" id="form3Examplev2" class="form-control form-control-lg" />
                  </div>

                </div>
              </div>
              <div class="col-lg-6 bg-indigo text-white">
                <div class="p-5">
                  <h3 class="fw-normal mb-5"><strong>Thông tin cá nhân</strong></h3>
                  <div class="mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea2">Họ và tên</label>
                        <input type="text" id="form3Examplea2" class="form-control form-control-lg" />            
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-7 mb-4 pb-2">
                        <div data-mdb-input-init class="form-outline form-white">
                            <label class="form-label" for="form3Examplea2">CCCD</label>
                            <input type="text" id="form3Examplea2" class="form-control form-control-lg" />            
                        </div>
                    </div>


                    <div class="col-md-5 mb-4 pb-2">
                        <div data-mdb-input-init class="form-outline form-white">
                            <label class="form-label" for="form3Examplea2">Ngày sinh</label>
                            <input type="date" id="form3Examplea2" class="form-control form-control-lg" />            
                        </div>
                    </div>

                  </div>
                  

                  <div class="mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea3">Địa chỉ</label>
                      <input type="text" id="form3Examplea3" class="form-control form-control-lg" />                      
                    </div>
                  </div>

                  <div class="mb-4 pb-2">
                    <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea3">Số điện thoại</label>
                      <input type="text" id="form3Examplea3" class="form-control form-control-lg" />                      
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-4 mb-4 pb-2">
                      <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea4">Chiều cao</label>
                        <input type="text" id="form3Examplea4" class="form-control form-control-lg" />                        
                      </div>

                    </div>
                    <div class="col-md-4 mb-4 pb-2">
                      <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea5">Cân nặng</label>
                        <input type="text" id="form3Examplea5" class="form-control form-control-lg" />                        
                      </div>
                    </div>
                    <div class="col-md-4 mb-4 pb-2">
                      <div data-mdb-input-init class="form-outline form-white">
                        <label class="form-label" for="form3Examplea5">Nhóm máu</label>
                        <input type="text" id="form3Examplea5" class="form-control form-control-lg" />                        
                      </div>
                    </div>
                  </div>

                  <button  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-light btn-lg"
                    data-mdb-ripple-color="dark">Register</button>

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
export default {    
    data(){
      return {

      };
    },

    methods: {
    },
};
</script>

<style scoped>
    @import "@/assets/register.css";
</style>

