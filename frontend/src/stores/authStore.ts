import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user'; 
import type { LoginCredentials, RegisterCredentials } from '../types/auth'; 
import authService from '../services/authService';
import userService from '../services/userService';
import router from '../router'; // Importação direta do router (certifique-se que o router exporta 'default')

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));
  
  // Estado global de loading e erro para autenticação
  const isLoading = ref(false); 
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function checkAuth() {
    if (token.value) {
      // Evita setar loading se for apenas uma verificação de fundo, 
      // mas se for refresh de perfil explícito, pode ser útil manter true.
      // Aqui mantemos true para consistência com o ProfileView.
      isLoading.value = true;
      error.value = null;
      try {
        const userProfile = await userService.getMyProfile();
        user.value = userProfile;
        localStorage.setItem('user', JSON.stringify(userProfile));
      } catch (err) {
        console.error("Sessão inválida ou expirada:", err);
        error.value = "Sessão expirada.";
        logout(true); // Logout silencioso ou com aviso
      } finally {
        isLoading.value = false;
      }
    }
  }

  const refreshProfile = checkAuth;

  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await authService.login(credentials);
      token.value = data.jwt;
      localStorage.setItem('token', data.jwt);
      
      // Busca perfil imediatamente antes de liberar
      await checkAuth();

      // Redirecionamento via Router (SPA friendly)
      router.push('/home');
      return true;
    } catch (err: any) {
      console.error('Erro no login:', err);
      // Captura mensagem do backend ou usa genérica
      error.value = err.response?.data?.error?.message || err.message || "Falha no login";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(credentials: RegisterCredentials) {
    isLoading.value = true;
    error.value = null;
    try {
      await authService.register(credentials);
      // Opcional: Já fazer login automático após registro ou redirecionar para login
      router.push('/login'); 
      return true; 
    } catch (err: any) {
      console.error('Erro no registro:', err);
      error.value = err.response?.data?.error?.message || "Erro ao registrar.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function logout(redirect = true) {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    error.value = null;
    
    if (redirect) {
      router.push('/login');
    }
  }

  // Inicialização: Se existir token, valida.
  // Nota: Em SSR isso pode causar problemas, mas em SPA puro é aceitável.
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