<template>
  <!-- Overlay cho modal -->
  <div v-if="isModalOpen" class="modal-overlay"></div>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-light bg-secondary-subtle">
    <!-- Container wrapper -->
    <div class="container">
      <!-- Navbar brand -->
      <a href="#" class="d-flex align-items-center p-3"
         style="max-width: 250px; margin-right: 200px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/2222/2222671.png" width="60" class="me-2">
        <p class="mb-0 fw-bold fs-2 text-muted"
           style="font-family: 'Poppins', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
          Clinic
        </p>
      </a>

      <!-- Toggle button -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Collapsible wrapper -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Left links -->
        <ul class="navbar-nav d-flex justify-content-evenly w-100 mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link d-flex flex-column align-items-center text-center"
               :class="{ 'active': activeNav === 'trangchu' }" href="#"
               @click.prevent="changeNav_value('trangchu')">
              <i class="fa-solid fa-home my-2 fs-5"></i>
              <span class="small">Trang chủ</span>
            </a>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link d-flex flex-column align-items-center text-center"
               :class="{ 'active': activeNav === 'lichkham' }" href="#"
               @click.prevent="changeNav_value('lichkham')">
              <i class="fa-solid fa-paper-plane my-2 fs-5"></i>
              <span class="small">Đặt lịch khám</span>
            </a>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link d-flex flex-column align-items-center text-center"
               :class="{ 'active': activeNav === 'hsbenhan' }" href="#"
               @click.prevent="changeNav_value('hsbenhan')">
              <i class="fa-solid fa-book my-2 fs-5"></i>
              <span class="small">Hồ sơ bệnh án</span>
            </a>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link d-flex flex-column align-items-center text-center"
               :class="{ 'active': activeNav === 'lichhen' }" href="#"
               @click.prevent="changeNav_value('lichhen')">
              <i class="fa-solid fa-clock my-2 fs-5"></i>
              <span class="small">Lịch hẹn</span>
            </a>
          </li>
          <router-link
              v-if="!isAuthenticated"
              :to="{ name: 'loginform' }"
              class="btn btn-primary btn-lg d-flex align-items-center gap-2">
            Đăng nhập
          </router-link>
          <router-link
              v-if="!isAuthenticated"
              :to="{ name: 'registerform' }"
              class="btn btn-secondary btn-lg d-flex align-items-center gap-2">
            Đăng ký
          </router-link>
          <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#staticBackdropmk"
                  v-if="isAuthenticated" @click="openModal">Đổi mật khẩu</button>
          <button class="btn btn-warning" @click.prevent="logout" v-if="isAuthenticated">Đăng xuất</button>

          <!-- Modal Đổi mật khẩu -->
          <div class="modal fade" id="staticBackdropmk" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
               aria-labelledby="staticBackdropLabelmk" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabelmk">Đổi mật khẩu</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                          @click="resetForm"></button>
                </div>
                <div class="modal-body">
                  <div v-if="patient">
                    <form @submit.prevent="changePassword">
                      <div class="mb-3">
                        <label for="username" class="form-label text-gray-700">Tên đăng nhập</label>
                        <input type="text" class="form-control" id="username" :value="patient.tendangnhapBN || 'N/A'" readonly>
                      </div>
                      <div class="mb-3">
                        <label for="fullName" class="form-label text-gray-700">Họ và tên</label>
                        <input type="text" class="form-control" id="fullName" :value="patient.hotenBN || 'N/A'" readonly>
                      </div>
                      <div class="mb-3">
                        <label for="currentPassword" class="form-label text-gray-700">Mật khẩu hiện tại</label>
                        <input type="password" class="form-control" id="currentPassword" v-model="currentPassword" required>
                      </div>
                      <div class="mb-3">
                        <label for="newPassword" class="form-label text-gray-700">Mật khẩu mới</label>
                        <input type="password" class="form-control" id="newPassword" v-model="newPassword" required>
                      </div>
                      <div class="mb-3">
                        <label for="confirmPassword" class="form-label text-gray-700">Xác nhận mật khẩu mới</label>
                        <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                      </div>
                      <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                      </div>
                    </form>
                  </div>
                  <div v-else class="alert alert-warning">
                    Không có thông tin bệnh nhân để đổi mật khẩu.
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">Đóng</button>
                  <button type="button" class="btn btn-primary" @click="changePassword" v-if="patient">Lưu thay đổi</button>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
      </div>
    </nav>
</template>

<script>
import patientService from '../../services/patient.service';
import bcrypt from 'bcryptjs';
export default {
  props: {
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
    patient: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      activeNav: 'trangchu',
      isModalOpen: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
    };
  },

  emits: ['change:nav_value', 'logout:success'],

  methods: {
    changeNav_value(name) {
      this.activeNav = name;
      this.$emit('change:nav_value', name);
    },

    logout() {
      this.activeNav = 'trangchu';
      this.$emit('change:nav_value', 'trangchu');
      this.$emit('logout:success');
    },

    openModal() {
      this.isModalOpen = true;
    },

    async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    },

    async changePassword() {
      if (!this.patient) {
        this.errorMessage = 'Không có thông tin bệnh nhân để đổi mật khẩu.';
        alert(this.errorMessage);
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
        alert(this.errorMessage);
        return;
      }
      if (this.newPassword.length < 6) {
        this.errorMessage = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
        alert(this.errorMessage);
        return;
      }
      try {
        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(this.currentPassword, this.patient.matkhauBN);
        if (!isMatch) {
          this.errorMessage = 'Mật khẩu hiện tại không đúng!';
          alert(this.errorMessage);
          return;
        }
        let patient = { ...this.patient };
        const isNewMatch = await bcrypt.compare(this.newPassword, this.patient.matkhauBN);
        if (isNewMatch) {
          this.errorMessage = 'Mật khẩu mới không được trùng với mật khẩu hiện tại!';
          alert(this.errorMessage);
          return;
        }
        patient.matkhauBN = await this.hashPassword(this.newPassword);
        patient.ngaysinhBN = this.parseDateForBackend(patient.ngaysinhBN);
        await patientService.update(this.patient.maBN, patient);
        alert('Đổi mật khẩu thành công!');
        this.resetForm();
      } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error.message);
        this.errorMessage = error.message || 'Đổi mật khẩu không thành công!';
        alert(this.errorMessage);
      }
    },

    resetForm() {
      this.isModalOpen = false;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = '';
    },

    formatValue(value, key) {
      if (!value) return 'N/A';
      if (key === 'ngaysinhBN' && typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date)) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      }
      return value;
    },

    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d)) return date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    parseDateForBackend(date) {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d)) return date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  },

  created() {
    this.changeNav_value('trangchu');
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}
.navbar-nav .nav-link {
  color: #6b7280;
  transition: all 0.3s ease;
}
.navbar-nav .nav-link:hover {
  color: #2563eb;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
}
.navbar-nav .nav-link.active {
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
  border-bottom: 2px solid #2563eb;
  border-radius: 0.25rem;
}
.navbar-nav .nav-link.active i {
  transform: scale(1.2);
}
.navbar-nav .nav-link i {
  transition: transform 0.3s ease;
}
</style>