import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';  // Named import (không phải default)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,  // { id: string, role: 'benhnhan' | 'bacsi' | 'admin', ... }
    token: null,  // JWT token string
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,  // Check cả token và user
  },
  actions: {
    setUser(user, token = null) {
      this.user = { ...user };
      if (token) {
        this.token = token;
        localStorage.setItem('JWT_TOKEN', token);  // Persist token ở localStorage
      }
      // Lưu user ở sessionStorage (mất khi đóng tab, an toàn hơn)
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    clearUser() {  // Đổi tên thành logout cho rõ ràng
      this.user = null;
      this.token = null;
      localStorage.removeItem('JWT_TOKEN');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId');  // Nếu có thêm field này
    },
    loadUser() {
      // Load token từ localStorage trước (vì persist lâu hơn)
      const token = localStorage.getItem('JWT_TOKEN');
      if (token) {
        try {
          // Decode token để lấy user info nếu backend embed (ví dụ: userId, role)
          const decoded = jwtDecode(token);  // Sử dụng named function jwtDecode
          this.token = token;
          
          // Load user từ sessionStorage, merge với decoded nếu cần
          const userData = sessionStorage.getItem('user');
          if (userData) {
            this.user = { ...JSON.parse(userData), ...decoded };  // Merge để cập nhật
          } else {
            // Nếu không có user ở session, dùng decoded làm user (nếu token có full info)
            this.user = decoded;
            sessionStorage.setItem('user', JSON.stringify(decoded));
          }
        } catch (err) {
          console.error('Token invalid:', err);
          this.clearUser();  // Clear nếu token hết hạn hoặc invalid
        }
      } else {
        // Fallback: Chỉ load user nếu không có token
        const userData = sessionStorage.getItem('user');
        if (userData) {
          this.user = JSON.parse(userData);
        }
      }
    },
  },
});