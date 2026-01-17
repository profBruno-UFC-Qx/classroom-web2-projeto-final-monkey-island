<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Gerir Utilizadores</h1>

    <div v-if="adminStore.loading" class="text-white">A carregar...</div>
    <div v-else class="bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-700 text-gray-300">
          <tr>
            <th class="px-6 py-3 text-left">Nome</th>
            <th class="px-6 py-3 text-left">Email</th>
            <th class="px-6 py-3 text-left">Role</th>
            <th class="px-6 py-3 text-left">Status</th>
            <th class="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-600">
          <tr v-for="user in adminStore.users" :key="user.id" class="text-gray-300">
            <td class="px-6 py-4">{{ user.name }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span :class="roleClass(user.role)" class="px-2 py-1 rounded text-xs font-bold">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span :class="user.status ? 'text-green-400' : 'text-red-400'">
                {{ user.status ? 'Ativo' : 'Banido' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button 
                v-if="user.role !== 'ADMIN'"
                @click="banUser(user.id)" 
                class="text-red-400 hover:text-red-300 font-semibold"
              >
                {{ user.status ? 'Banir' : 'Desbanir' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchUsers();
});

const banUser = async (id: string) => {
  if (confirm('Tem a certeza que deseja alterar o status deste utilizador?')) {
    await adminStore.banUserAction(id);
  }
};

const roleClass = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'bg-red-900 text-red-200';
    case 'RESEARCHER': return 'bg-blue-900 text-blue-200';
    default: return 'bg-gray-600 text-gray-200';
  }
};
</script>