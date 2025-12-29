import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user'; 
import type { LoginCredentials } from '../types/auth'; 
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', () => {
  // Estado inicial recuperando do localStorage para manter a sessão ao dar F5
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));

  // Computed para verificar se está logado
  const isAuthenticated = computed(() => !!token.value);

  /**
   * Realiza o login e armazena o JWT retornado pelo backend
   */
  async function login(credentials: LoginCredentials) {
    try {
      const data = await authService.login(credentials);
      
      // No seu backend, o token vem na chave 'jwt'
      token.value = data.jwt;
      
      // Persistência local
      localStorage.setItem('token', data.jwt);

      /**
       * NOTA: Como o seu backend atual NÃO retorna o objeto 'user' no login,
       * o campo 'user.value' continuará null até que você implemente uma rota 
       * de perfil (ex: /auth/me) ou altere o backend para enviar o usuário.
       */
      
      return true;
    } catch (error) {
      console.error('Erro no login no Pinia:', error);
      throw error;
    }
  }

  /**
   * Limpa o estado e remove os dados do navegador
   */
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