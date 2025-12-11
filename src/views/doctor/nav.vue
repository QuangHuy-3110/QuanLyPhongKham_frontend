```vue
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
               @click="changeNav_value('trangchu')">
              <i class="fa-solid fa-home my-2 fs-5"></i>
              <span class="small">Trang chủ</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex flex-column align-items-center text-center"
               :class="{ 'active': activeNav === 'lichkham' }" href="#"
               @click="changeNav_value('lichkham')">
              <i class="fa-solid fa-paper-plane my-2 fs-5"></i>
              <span class="small">Lịch khám</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex flex-column align-items-center text-center"
               :class="{ 'active': activeNav === 'benhnhan' }" href="#"
               @click="changeNav_value('benhnhan')">
              <i class="fa-solid fa-book my-2 fs-5"></i>
              <span class="small">Bệnh nhân</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex flex-column align-items-center text-center"
               :class="{ 'active': activeNav === 'lichhen' }" href="#"
               @click="changeNav_value('lichhen')">
              <i class="fa-solid fa-clock my-2 fs-5"></i>
              <span class="small">Lịch hẹn</span>
            </a>
          </li>
          <!-- Dropdown -->
          <div class="d-flex gap-3">
            <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#accountModal" @click="openModal" :disabled="!doctor">Tài khoản</button>
            <button class="btn btn-warning" @click.prevent="logout">Đăng xuất</button>

            <!-- Modal Tài khoản -->
            <div class="modal fade" id="accountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                 aria-labelledby="accountModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header bg-gray-700 text-gray-100">
                    <h5 class="modal-title" id="accountModalLabel">
                      {{ isEditing ? 'Chỉnh sửa thông tin' : (showPasswordForm ? 'Đổi mật khẩu' : 'Thông tin tài khoản') }}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"
                            @click="resetForm"></button>
                  </div>
                  <div class="modal-body">
                    <!-- Thông tin bác sĩ -->
                    <div v-if="!showPasswordForm && doctor" class="row">
                      <div v-for="field in doctorFields" :key="field.key" class="col-md-6 mb-3">
                        <label :for="field.key" class="form-label text-gray-700">{{ field.label }}</label>
                        <input v-if="!isEditing"
                               :id="field.key"
                               :value="formatValue(doctor[field.key], field.key)"
                               class="form-control"
                               readonly>
                        <input v-else-if="field.type !== 'textarea'"
                               :id="field.key"
                               v-model="editDoctor[field.key]"
                               :type="field.type || 'text'"
                               class="form-control"
                               :disabled="field.disabled"
                               :placeholder="field.label">
                        <textarea v-else-if="isEditing"
                                  :id="field.key"
                                  v-model="editDoctor[field.key]"
                                  class="form-control"
                                  :disabled="field.disabled"
                                  :placeholder="field.label"></textarea>
                      </div>
                    </div>
                    <div v-else-if="!showPasswordForm && !doctor" class="alert alert-warning">
                      Không có thông tin bác sĩ để hiển thị.
                    </div>
                    <!-- Form đổi mật khẩu -->
                    <div v-if="showPasswordForm && doctor">
                      <form @submit.prevent="changePassword">
                        <div class="mb-3">
                          <label for="username" class="form-label text-gray-700">Tên đăng nhập</label>
                          <input type="text" class="form-control" id="username" :value="doctor.maBS || 'N/A'" readonly>
                        </div>
                        <div class="mb-3">
                          <label for="fullName" class="form-label text-gray-700">Họ và tên</label>
                          <input type="text" class="form-control" id="fullName" :value="doctor.tenBS || 'N/A'" readonly>
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
                    <div v-else-if="showPasswordForm && !doctor" class="alert alert-warning">
                      Không có thông tin bác sĩ để đổi mật khẩu.
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button v-if="!showPasswordForm && doctor && !isEditing" type="button" class="btn btn-warning me-2"
                            @click="toggleEdit">
                      Sửa
                    </button>
                    <button v-if="!showPasswordForm && doctor && isEditing" type="button" class="btn btn-primary me-2"
                            @click="saveChanges">
                      Lưu
                    </button>
                    <button v-if="!showPasswordForm && doctor && isEditing" type="button" class="btn btn-secondary me-2"
                            @click="cancelEdit">
                      Hủy
                    </button>
                    <button v-if="!showPasswordForm && doctor" type="button" class="btn btn-primary me-2"
                            @click="showPasswordForm = true">
                      Đổi mật khẩu
                    </button>
                    <button v-if="showPasswordForm && doctor" type="button" class="btn btn-primary me-2"
                            @click="changePassword">
                      Lưu thay đổi
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">
                      Đóng
                    </button>
                  </div>
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
import doctorService from '../../services/doctor.service';
import bcrypt from 'bcryptjs';

export default {
  props: {
    doctor: { type: Object, required: true },
  },
  data() {
    return {
      activeNav: 'trangchu',
      isEditing: false,
      showPasswordForm: false,
      isModalOpen: false,
      editDoctor: null,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
      doctorFields: [
        { key: 'maBS', label: 'Mã bác sĩ', disabled: true },
        { key: 'cccdBS', label: 'CCCD', disabled: true },
        { key: 'tenBS', label: 'Họ và tên' },
        { key: 'ngaysinhBS', label: 'Ngày sinh', type: 'date' },
        { key: 'sdtBS', label: 'Số điện thoại' },
        { key: 'emailBS', label: 'Email' },
        { key: 'diachiBS', label: 'Địa chỉ', type: 'textarea' },
        { key: 'soCCHN', label: 'Số CCHN' },
        { key: 'noicapCCHN', label: 'Nơi cấp CCHN' },
      ],
    };
  },
  emits: ['change:nav_value', 'logout:logout'],
  methods: {
    changeNav_value(name) {
      this.activeNav = name;
      this.$emit('change:nav_value', name);
    },

    logout() {
      this.$emit('logout:logout');
    },

    openModal() {
      if (!this.doctor) {
        this.errorMessage = 'Không có thông tin bác sĩ để hiển thị.';
        return;
      }
      this.isModalOpen = true;
    },

    toggleEdit() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.editDoctor = {
          ...this.doctor,
          ngaysinhBS: this.formatDateForInput(this.doctor.ngaysinhBS),
          diachiBS: this.doctor.diachiBS || '',
        };
      } else {
        this.editDoctor = null;
      }
    },

    async saveChanges() {
      try {
        if (!this.editDoctor) throw new Error('Không có dữ liệu để lưu');
        // Validate input
        if (!this.editDoctor.tenBS) throw new Error('Họ và tên không được để trống');
        if (!this.editDoctor.sdtBS) throw new Error('Số điện thoại không được để trống');
        if (!this.editDoctor.emailBS || !/\S+@\S+\.\S+/.test(this.editDoctor.emailBS)) throw new Error('Email không hợp lệ');
        const updatedDoctor = {
          ...this.editDoctor,
          ngaysinhBS: this.parseDateForBackend(this.editDoctor.ngaysinhBS),
        };
        await doctorService.update(this.doctor.maBS, updatedDoctor);
        alert('Cập nhật thông tin thành công!');
        this.isEditing = false;
        this.errorMessage = '';
      } catch (error) {
        console.error('Lỗi khi cập nhật thông tin:', error.message);
        this.errorMessage = error.message || 'Cập nhật thông tin không thành công!';
      }
    },

    cancelEdit() {
      this.isEditing = false;
      this.editDoctor = null;
      this.errorMessage = '';
    },

    async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    },

    async changePassword() {
      if (!this.doctor) {
        this.errorMessage = 'Không có thông tin bác sĩ để đổi mật khẩu.';
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
        const isMatch = await bcrypt.compare(this.currentPassword, this.doctor.matkhau);
        if (!isMatch) {
          this.errorMessage = 'Mật khẩu hiện tại không đúng!';
          alert(this.errorMessage);
          return;
        }
        // Kiểm tra mật khẩu mới không trùng mật khẩu hiện tại
        let doctor = { ...this.doctor };
        doctor.ngaysinhBS = this.parseDateForBackend(doctor.ngaysinhBS);
        const isNewMatch = await bcrypt.compare(this.newPassword, this.doctor.matkhau);
        if (isNewMatch) {
          this.errorMessage = 'Mật khẩu mới không được trùng với mật khẩu hiện tại!';
          alert(this.errorMessage);
          return;
        }
        doctor.matkhau = await this.hashPassword(this.newPassword);
        await doctorService.update(this.doctor.maBS, doctor);
        alert('Đổi mật khẩu thành công!');
        this.resetForm();
      } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error.message);
        this.errorMessage = error.message || 'Đổi mật khẩu không thành công!';
        alert(this.errorMessage);
      }
    },

    resetForm() {
      this.isEditing = false;
      this.showPasswordForm = false;
      this.isModalOpen = false;
      this.editDoctor = null;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = '';
    },

    formatValue(value, key) {
      if (!value) return 'N/A';
      if (key === 'ngaysinhBS' && typeof value === 'string') {
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

  mounted() {
    this.changeNav_value('trangchu');
  },
};
</script>

<style scoped>
/* Modal overlay styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  backdrop-filter: blur(3px);
  transition: opacity 0.3s ease;
}

/* Modal dialog styles */
/* .modal-dialog {
  margin: 1.75rem auto;
  max-width: 600px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: translateY(-50px);
  opacity: 0;
} */

.modal.show .modal-dialog {
  transform: translateY(0);
  opacity: 1;
}

/* Modal content styles */
.modal-content {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background: #ffffff;
}

/* Modal header styles */
.modal-header {
  background: linear-gradient(135deg, #4b5e6d, #6b7280);
  color: #ffffff;
  padding: 1.25rem;
  border-bottom: none;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.btn-close-white {
  filter: invert(1);
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.btn-close-white:hover {
  opacity: 1;
}

/* Modal body styles */
.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-body .form-label {
  font-weight: 500;
  color: #4b5e6d;
  margin-bottom: 0.5rem;
}

.modal-body .form-control {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.modal-body .form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

.modal-body .form-control[readonly] {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.modal-body textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* Modal footer styles */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

.modal-footer .btn {
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.modal-footer .btn:hover {
  transform: translateY(-1px);
}

.modal-footer .btn-primary {
  background-color: #2563eb;
  border-color: #2563eb;
}

.modal-footer .btn-primary:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.modal-footer .btn-secondary {
  background-color: #6b7280;
  border-color: #6b7280;
}

.modal-footer .btn-secondary:hover {
  background-color: #4b5e6d;
  border-color: #4b5e6d;
}

.modal-footer .btn-warning {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.modal-footer .btn-warning:hover {
  background-color: #d97706;
  border-color: #d97706;
}

/* Alert styles within modal */
.modal-body .alert {
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  margin-top: 1rem;
}

/* Navbar styles (unchanged) */
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
```