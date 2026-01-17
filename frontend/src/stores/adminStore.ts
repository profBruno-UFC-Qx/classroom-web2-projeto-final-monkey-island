import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/user';
import type { Artifact } from '@/types/artifact';
import type { ResearcherRequestResponse } from '@/types/researcherRequest';
import userService from '@/services/userService';
import artifactService from '@/services/artifactService';
import researcherRequestService from '@/services/researcherRequestService';

export const useAdminStore = defineStore('admin', () => {
  // Estado
  const users = ref<User[]>([]);
  const adminArtifacts = ref<Artifact[]>([]);
  const pendingRequests = ref<ResearcherRequestResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Ações de Usuários
  async function fetchUsers() {
    loading.value = true;
    try {
      users.value = await userService.getAllUsers();
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar usuários';
    } finally {
      loading.value = false;
    }
  }

  async function banUserAction(userId: string) {
    try {
      await userService.banUser(userId);
      // Atualiza a lista localmente para refletir o banimento sem recarregar tudo
      const user = users.value.find(u => u.id === userId);
      if (user) user.status = false; // Assumindo que false = banido/inativo no booleano
    } catch (err: any) {
      console.error('Erro ao banir usuário', err);
      throw err;
    }
  }

  // Ações de Artefatos
  async function fetchAdminArtifacts() {
    loading.value = true;
    try {
      adminArtifacts.value = await artifactService.getAllArtifacts();
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar artefatos';
    } finally {
      loading.value = false;
    }
  }

  async function createArtifactAction(formData: FormData) {
    try {
      const newArtifact = await artifactService.createArtifact(formData);
      adminArtifacts.value.push(newArtifact);
    } catch (err: any) {
      console.error('Erro ao criar artefato', err);
      throw err;
    }
  }

  async function deleteArtifactAction(id: string) {
    try {
      await artifactService.deleteArtifact(id);
      adminArtifacts.value = adminArtifacts.value.filter(a => a.id !== id);
    } catch (err: any) {
      console.error('Erro ao deletar artefato', err);
      throw err;
    }
  }

  // Ações de Solicitações de Pesquisador
  async function fetchPendingRequests() {
    loading.value = true;
    try {
      // O endpoint do backend retorna uma lista diretamente ou um objeto com data?
      // Baseado no service atual: return (await api.get("/researcher-request")).data;
      const data = await researcherRequestService.getPendingRequests();
      // Verifique se o backend retorna array direto ou { requests: [] }
      // Assumindo que é array baseado no tipo esperado
      pendingRequests.value = Array.isArray(data) ? data : []; 
    } catch (err: any) {
      error.value = 'Erro ao buscar solicitações';
    } finally {
      loading.value = false;
    }
  }

  async function approveRequestAction(requestId: string) {
    try {
      await researcherRequestService.approveRequest(requestId);
      pendingRequests.value = pendingRequests.value.filter(r => r.id !== requestId);
    } catch (err) {
      throw err;
    }
  }

  async function rejectRequestAction(requestId: string) {
    try {
      await researcherRequestService.rejectRequest(requestId);
      pendingRequests.value = pendingRequests.value.filter(r => r.id !== requestId);
    } catch (err) {
      throw err;
    }
  }

  return {
    users,
    adminArtifacts,
    pendingRequests,
    loading,
    error,
    fetchUsers,
    banUserAction,
    fetchAdminArtifacts,
    createArtifactAction,
    deleteArtifactAction,
    fetchPendingRequests,
    approveRequestAction,
    rejectRequestAction
  };
});