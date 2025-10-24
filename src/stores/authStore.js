import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    // ⚠️ FIX: Kiểm tra cả token VÀ user, plus token phải valid
    isLoggedIn: (state) => {
      if (!state.token || !state.user) return false;
      
      // ⚠️ MỚI: Kiểm tra token có hết hạn không
      try {
        const decoded = jwtDecode(state.token);
        const now = Date.now() / 1000;  // Convert to seconds
        
        // Check expiry nếu token có field 'exp'
        if (decoded.exp && decoded.exp < now) {
          console.warn('⚠️ Token expired, clearing auth');
          // Token hết hạn → Clear auth (sẽ trigger trong component)
          return false;
        }
        
        return true;
      } catch (err) {
        console.error('❌ Token decode failed:', err);
        return false;
      }
    },
  },
  actions: {
    setUser(user, token = null) {
      // ⚠️ FIX: Validate token trước khi set
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < now) {
            console.error('❌ Cannot set expired token');
            return;
          }
          
          this.token = token;
          localStorage.setItem('JWT_TOKEN', token);
        } catch (err) {
          console.error('❌ Invalid token format:', err);
          return;
        }
      }
      
      this.user = { ...user };
      sessionStorage.setItem('user', JSON.stringify(user));
      console.log('✅ User set:', user.id || user.maBN, 'Token:', !!token);
    },
    
    clearUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('JWT_TOKEN');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId');
      console.log('🔓 User cleared (logged out)');
    },
    
    loadUser() {
      // Load token từ localStorage
      const token = localStorage.getItem('JWT_TOKEN');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          
          // ⚠️ FIX: Kiểm tra expiry
          if (decoded.exp && decoded.exp < now) {
            console.warn('⚠️ Stored token expired, clearing');
            this.clearUser();
            return;
          }
          
          this.token = token;
          
          // Load user từ sessionStorage
          const userData = sessionStorage.getItem('user');
          if (userData) {
            this.user = { ...JSON.parse(userData), ...decoded };
            console.log('✅ User loaded from storage:', this.user.id || this.user.maBN);
          } else {
            // Nếu không có user trong session, dùng decoded làm user
            this.user = decoded;
            sessionStorage.setItem('user', JSON.stringify(decoded));
            console.log('✅ User loaded from token:', this.user.id || this.user.maBN);
          }
        } catch (err) {
          console.error('❌ Token load failed:', err);
          this.clearUser();
        }
      } else {
        // Không có token → Guest mode
        const userData = sessionStorage.getItem('user');
        if (userData) {
          // Có user nhưng không có token → Invalid state, clear
          console.warn('⚠️ Found user without token, clearing');
          this.clearUser();
        } else {
          console.log('👤 No token found, guest mode');
        }
      }
    },
  },
});