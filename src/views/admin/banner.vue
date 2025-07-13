<template>
  <div style="padding: 10px 50px; display: flex; align-items: center;" class="bg-secondary text-white p-3">
    <img src="https://cdn-icons-png.flaticon.com/512/2222/2222671.png" width="100" alt="Logo">
    <div class="page-header pt-3" style="padding-left: 50px;">
      <h3>Hệ thống quản lý phòng khám</h3>
      <p class="lead">Admin</p>
    </div>
    <div class="ms-auto d-flex align-items-center gap-3">
      <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#staticBackdropmk">Đổi mật khẩu</button>
      <button class="btn btn-warning" @click.prevent="logout">Đăng xuất</button>

      <div class="modal fade" 
           id="staticBackdropmk" 
           data-bs-backdrop="true" 
           data-bs-keyboard="false" 
           tabindex="-1"
           aria-labelledby="staticBackdropLabelmk" 
           aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            
            <div class="modal-header bg-gray-700 text-gray-100">
              <h5 class="modal-title" id="staticBackdropLabelmk">Đổi mật khẩu</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" @click="resetForm"></button>
            </div>

            <div class="modal-body">
              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label for="username" class="form-label text-gray-700">Tên đăng nhập</label>
                  <input type="text" class="form-control" id="username" v-model="userInfo.tenDangNhap" readonly>
                </div>
                <div class="mb-3">
                  <label for="fullName" class="form-label text-gray-700">Họ và tên</label>
                  <input type="text" class="form-control" id="fullName" v-model="userInfo.fullName" readonly>
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
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">Đóng</button>
              <button type="button" class="btn btn-primary" @click="changePassword">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import doctorService from '../../services/doctor.service';
import patientService from '../../services/patient.service';
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
      userInfo: {
        tenDangNhap: '',
        fullName: '',
      },
      authStore: useAuthStore(),
    };
  },
  async created() {
    await this.loadUserInfo();
  },
  methods: {
    async loadUserInfo() {
      try {
        const user = this.authStore.user;
        if (!user || !user.id) {
          this.errorMessage = 'Không tìm thấy thông tin người dùng';
          return;
        }

        if (user.role === 'benhnhan') {
          const patient = await patientService.get_acname(user.id);
          if (patient && patient.length > 0) {
            this.userInfo = {
              tenDangNhap: patient[0].tenDangNhap || user.id,
              fullName: patient[0].hoTen || 'Không xác định',
            };
          } else {
            this.errorMessage = 'Không tìm thấy thông tin bệnh nhân';
          }
        } else if (user.role === 'doctor' || user.role === 'admin') {
          const doctor = await doctorService.get(user.id);
          console.log('Doctor data:', doctor); // Debug
          if (doctor) {
            this.userInfo = {
              tenDangNhap: doctor.tenDangNhap || user.id,
              fullName: doctor.tenBS || 'Không xác định',
            };
          } else {
            this.errorMessage = 'Không tìm thấy thông tin bác sĩ';
          }
        } else {
          this.errorMessage = 'Vai trò người dùng không hợp lệ';
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        this.errorMessage = 'Không thể tải thông tin người dùng';
      }
    },
    
    async changePassword() {
      try {
        // Kiểm tra hợp lệ
        if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
          this.errorMessage = 'Vui lòng nhập đầy đủ các trường';
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          this.errorMessage = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
          return;
        }
        if (this.newPassword.length < 6) {
          this.errorMessage = 'Mật khẩu mới phải có ít nhất 6 ký tự';
          return;
        }

        const user = this.authStore.user;
        if (!user || !user.id) {
          this.errorMessage = 'Không tìm thấy thông tin người dùng';
          return;
        }

        // Xác định vai trò và gọi API tương ứng
        let isPasswordValid = false;
        let updatePayload = {};
        if (user.role === 'benhnhan') {
          const patient = await patientService.get_acname(user.id);
          if (!patient || patient.length === 0) {
            this.errorMessage = 'Không tìm thấy thông tin bệnh nhân';
            return;
          }
          isPasswordValid = await bcrypt.compare(this.currentPassword, patient[0].matkhauBN);
          updatePayload = { maBN: user.id, matkhauBN: await bcrypt.hash(this.newPassword, 10) };
        } else if (user.role === 'doctor' || user.role === 'admin') {
          const doctor = await doctorService.get(user.id);
          if (!doctor) {
            this.errorMessage = 'Không tìm thấy thông tin bác sĩ';
            return;
          }
          isPasswordValid = await bcrypt.compare(this.currentPassword, doctor.matkhau);
          updatePayload = { maBS: user.id, matkhau: await bcrypt.hash(this.newPassword, 10) };
        } else {
          this.errorMessage = 'Vai trò người dùng không hợp lệ';
          return;
        }

        if (!isPasswordValid) {
          this.errorMessage = 'Mật khẩu hiện tại không đúng';
          return;
        }

        // Cập nhật mật khẩu
        if (user.role === 'benhnhan') {
          await patientService.update(user.id, updatePayload);
        } else {
          await doctorService.update(user.id, updatePayload);
        }

        alert('Đổi mật khẩu thành công!');
        this.resetForm();
        document.getElementById('staticBackdropmk').classList.remove('show');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        this.errorMessage = 'Đổi mật khẩu thất bại, vui lòng thử lại';
      }
    },
    resetForm() {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = '';
    },
    logout() {
      this.authStore.clearUser();
      this.$router.push({ name: 'loginform' });
    },
  },
};
</script>

<style scoped>
.modal-header {
  background-color: #374151;
  color: #f3f4f6;
}

.modal-content {
  border-radius: 0.5rem;
}

.btn-close-white {
  filter: invert(1);
}

/* Đảm bảo các nút có kích thước đồng đều */
.btn {
  min-width: 120px;
  padding: 8px 16px;
}

/* Tùy chỉnh thêm nếu cần */
.page-header {
  flex: 1;
}

.d-flex.align-items-center.gap-3 {
  gap: 12px;
}

/* Style cho form đổi mật khẩu */
.form-label {
  color: #374151;
}

.alert-danger {
  font-size: 14px;
  padding: 8px;
  margin-top: 10px;
}

/* Style cho input chỉ đọc */
input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}
</style>