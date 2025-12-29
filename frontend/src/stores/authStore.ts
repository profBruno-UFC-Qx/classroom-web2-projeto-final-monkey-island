import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user'; 
import type { LoginCredentials } from '../types/auth'; 
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials) {
    try {
      const data = await authService.login(credentials);
      

      token.value = data.jwt;
      

      localStorage.setItem('token', data.jwt);

      return true;
    } catch (error) {
      console.error('Erro no login no Pinia:', error);
      throw error;
    }
  }


  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return { 
    user, 
    token, 
    isAuthenticated, 
    login, 
    logout 
  };
});