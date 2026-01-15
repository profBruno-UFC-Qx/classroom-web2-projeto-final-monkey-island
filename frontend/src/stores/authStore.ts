import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user'; 
import type { LoginCredentials, RegisterCredentials } from '../types/auth'; 
import authService from '../services/authService';
import userService from '../services/userService';

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);

  async function checkAuth() {
    if (token.value) {
      try {
        const userProfile = await userService.getMyProfile();
        user.value = userProfile;
        localStorage.setItem('user', JSON.stringify(userProfile));
      } catch (error) {
        console.error("Sessão inválida ou expirada:", error);
        logout(); 
      }
    }
  }

  async function login(credentials: LoginCredentials) {
    try {

      const data = await authService.login(credentials);
      
      token.value = data.jwt;
      localStorage.setItem('token', data.jwt);


      const userProfile = await userService.getMyProfile();

      user.value = userProfile;
      localStorage.setItem('user', JSON.stringify(userProfile));

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      logout();
      throw error;
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      await authService.register(credentials);
      return true; 
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login'; 
  }


  if (token.value) {
    checkAuth();
  }

  return { user, token, isAuthenticated, login, logout, register, checkAuth };
});