import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/user';
import type { Artifact } from '@/types/artifact';
import type { ResearcherRequestResponse } from '@/types/researcherRequest';
import userService from '@/services/userService';
import artifactService from '@/services/artifactService';
import researcherRequestService from '@/services/researcherRequestService';

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([]);
  const adminArtifacts = ref<Artifact[]>([]);
  const pendingRequests = ref<ResearcherRequestResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

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
      const user = users.value.find(u => u.id === userId);
      if (user) user.status = false;
    } catch (err: any) {
      console.error('Erro ao banir usuário', err);
      throw err;
    }
  }

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

  async function fetchPendingRequests() {
    loading.value = true;
    try {
      const data = await researcherRequestService.getPendingRequests();
      pendingRequests.value = data;
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