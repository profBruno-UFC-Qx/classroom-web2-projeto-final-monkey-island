import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user'; 
import type { LoginCredentials, RegisterCredentials } from '../types/auth'; 
import authService from '../services/authService';
import userService from '../services/userService';

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLoading = ref(false); // Adicionado estado de loading global para auth
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  // Refatorado: checkAuth agora pode ser usado para forçar atualização
  async function checkAuth() {
    if (token.value) {
      isLoading.value = true;
      error.value = null;
      try {
        const userProfile = await userService.getMyProfile();
        user.value = userProfile;
        localStorage.setItem('user', JSON.stringify(userProfile));
      } catch (err) {
        console.error("Sessão inválida ou expirada:", err);
        error.value = "Sessão expirada.";
        logout(); 
      } finally {
        isLoading.value = false;
      }
    }
  }

  // Alias para ficar semântico na ProfileView
  const refreshProfile = checkAuth;

  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await authService.login(credentials);
      token.value = data.jwt;
      localStorage.setItem('token', data.jwt);
      
      // Busca perfil imediatamente
      await checkAuth();

      return true;
    } catch (err: any) {
      console.error('Erro no login:', err);
      error.value = err.message || "Falha no login";
      logout();
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(credentials: RegisterCredentials) {
    isLoading.value = true;
    try {
      await authService.register(credentials);
      return true; 
    } catch (err) {
      console.error('Erro no registro:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirecionamento deve ser feito no componente ou router guard, não idealmente aqui, mas mantendo a lógica original:
    window.location.href = '/login'; 
  }

  if (token.value) {
    checkAuth();
  }

  return { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error,
    login, 
    logout, 
    register, 
    checkAuth,
    refreshProfile 
  };
});