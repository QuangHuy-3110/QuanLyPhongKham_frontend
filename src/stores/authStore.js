import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { id: string, role: 'benhnhan' | 'bacsi' | 'admin' }
  }),
  actions: {
    setUser(user) {
      this.user = { ...user };
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    clearUser() {
      this.user = null;
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId');
    },
    loadUser() {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
  },
});