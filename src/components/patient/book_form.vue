<template>
<!-- Post a Comment -->
<div class="container content-space-2">
  <!-- Heading -->
  
  <!-- End Heading -->

  <div class="row justify-content-lg-center">
    <div class="col-lg-10">
      <!-- Card -->
      <div class="card card-lg border shadow-none">
        <div class="w-md-75 w-lg-50 text-center mx-md-auto mb-5 mb-md-9">
          <p class="mb-0 fw-bold fs-2 text-muted mt-4"
              style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
              Đặt khám chuyên khoa
          </p>
          <hr>
        </div>

        <p class="text-center" style="font-family: 'Poppins', sans-serif; font-size: 18px;">"<i>Hãy tạo lịch hẹn khám của bạn bằng cách hoàn thành các thao tác bên dưới</i>"</p>
        
        <div class="card-body">
          <!-- <form> -->
            <div class="d-grid gap-4">
              <!-- Form -->
              <div class="row">

                <!-- Chọn chuyên khoa -->
                <div class="container py-4">
                  <label class="form-label">Chọn chuyên khoa để khám</label>
                  <div class="row gy-3 mt-2 mx-4">
                    <Doctor_specialty/>
                  </div>
                </div>


                <!-- Chọn bác sĩ -->
                <div class="container py-4">
                  <label class="form-label">Chọn bác sĩ</label>
                  <div class="row gy-3 mt-2">
                    <Profile_doctor/>
                  </div>
                </div>
              </div>
              
              <!-- Lịch khám của bác sĩ -->
              <span class="d-block">
                <label class="form-label">Lịch khám của bác sĩ</label>
                <Calendar class="form-control form-control-lg"/>
              </span>
              
              <!-- Chọn thời gian khám -->
              <div class="container py-4">
                <div class="row g-3">
                  <div class="col-4">
                    <label for="ngayHen" class="form-label">Chọn ngày</label>
                    <input type="date" class="form-control" id="ngayHen" name="ngayHen" required>
                  </div>
                  <div class="col-4">
                    <label for="buoiHen" class="form-label">Chọn buổi</label>
                    <select class="form-select" id="buoiHen" name="buoiHen" required>
                      <option value="" disabled selected>Chọn buổi</option>
                      <option value="sang">Sáng</option>
                      <option value="chieu">Chiều</option>
                    </select>
                  </div>
                  <div class="col-4">
                    <label for="gioHen" class="form-label">Chọn giờ</label>
                    <input type="time" class="form-control" id="gioHen" name="gioHen" required>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <span class="d-block">
                <label class="form-label" for="blogContactsFormComment">Mô tả bệnh trạng</label>
                <textarea class="form-control form-control-lg" id="blogContactsFormComment" name="blogContactsCommentName" placeholder="Hãy mô tả sơ lượt trạng thái bệnh của bạn ở đây...." aria-label="Leave your comment here..." rows="5"></textarea>
              </span>
              <!-- End Form -->

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">Đặt lịch</button>
              </div>
            </div>
          <!-- </form> -->
        </div>
      </div>
      <!-- End Card -->
    </div>
    <!-- End Col -->
  </div>
  <!-- End Row -->
</div>
<!-- End Post a Comment -->
</template>

<script>
    import Calendar from '../element/calendar.vue';
    import Profile_doctor from './profile_doctor.vue';
    import Doctor_specialty from './doctor_specialty.vue';
    export default {
        components: {
            Calendar,
            Profile_doctor,
            Doctor_specialty
        }
    }
</script>