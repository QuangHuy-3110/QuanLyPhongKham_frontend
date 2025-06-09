<template>
    <hr>
    <div class="container">
    <div class="d-flex align-items-center gap-4">
      <div>
        <!-- Profile picture image -->
        <img class="img-account-profile rounded-circle img-fluid" style="width: 100px; height: 100px; object-fit: cover;" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="">
      </div>
      <div>
        <p class="d-flex gap-5 my-3">
          <span>Họ và tên:</span>
          <span>CCCD:</span>
          <span>SĐT:</span>
        </p>
        <p class="d-flex gap-5 my-3">
          <span>Địa chỉ:</span>
        </p>
        <p class="d-flex gap-5 my-3">
          <span>Ngày sinh:</span>
          <span>Chiều cao:</span>
          <span>Cân nặng:</span>
          <span>Nhóm máu:</span>
        </p>
      </div>
    </div>
  </div>
    <hr>
    <div class="container">
      <div class="row">
        
        <div class="col-md-6 scrollable-column">
          <h3 class="text-center mx-3">Danh sách bệnh án</h3>
          <button class="btn btn-success mb-3" type="button" data-bs-toggle="modal" data-bs-target="#illness_form">
            <i class="fa-solid fa-plus"></i> Thêm hồ sơ mới
          </button>

          <!-- Card 1 in first column -->
          <div class="card mb-3" style="width: 100%;">
            <div class="card-body">
              <h5 class="card-title">Card title 1</h5>
              <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="card-link">Card link</a>
              <a href="#" class="card-link">Another link</a>
            </div>
          </div>
          <!-- Additional card in first column -->
          <div class="card mb-3" style="width: 100%;">
            <div class="card-body">
              <h5 class="card-title">Card title 2</h5>
              <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
              <p class="card-text">Additional card in the first column to demonstrate independent columns.</p>
              <p class="card-text">More content to trigger scrolling.</p>
              <p class="card-text">More content to trigger scrolling.</p>
              <a href="#" class="card-link">Card link</a>
              <a href="#" class="card-link">Another link</a>
            </div>
          </div>
        </div>
        <div class="col-md-6 d-flex">
          <div class="vertical-divider mx-3"></div>
          <div class="scrollable-column" style="width: 100%;">

            <h3 class="text-center mx-3">Danh sách lần khám</h3>
            
            <button class="btn btn-success mb-3" type="button" data-bs-toggle="modal" data-bs-target="#exam_form">
              <i class="fa-solid fa-plus"></i> Thêm lần khám
            </button>

            <!-- Card in second column -->
            <div class="card mb-3" style="width: 100%;">
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p class="card-text">This card has different content to demonstrate independent height. It is longer to show that the height is not aligned with the other column.</p>
                <p class="card-text">Additional text for more content.</p>
                <p class="card-text">More content to trigger scrolling.</p>
                <p class="card-text">More content to trigger scrolling.</p>
                <p class="card-text">More content to trigger scrolling.</p>
                <a href="#" class="card-link">Card link</a>
                <a href="#" class="card-link">Another link</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    


    <!-- Modal Exam form-->
    <div class="modal fade" id="exam_form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Exam_form/>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Exam form-->
    <div class="modal fade" id="illness_form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Illness_form/>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import Exam_form from './exam_form.vue';
    import Illness_form from './illness_form.vue';
    export default {

      data (){
        return {
          status: ''
        }
      },

      components: {
        Exam_form,
        Illness_form
      }
    }
</script>

<style scoped>
.scrollable-column {
  max-height: 700px; /* Giới hạn chiều cao của cột */
  overflow-y: auto; /* Kích hoạt thanh cuộn dọc */
}
.vertical-divider {
  border-left: 1px solid #dee2e6; /* Đường kẻ dọc màu xám nhạt */
  height: auto; /* Chiều cao tự điều chỉnh theo cột cao nhất */
  align-self: stretch; /* Kéo dài theo chiều cao của cột */
}
</style>