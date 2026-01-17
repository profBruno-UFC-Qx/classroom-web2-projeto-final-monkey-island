<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Gerir Artefatos</h1>
      <button @click="showForm = !showForm" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        {{ showForm ? 'Cancelar' : 'Novo Artefato' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
      <h2 class="text-xl text-white mb-4">Novo Artefato</h2>
      <form @submit.prevent="createArtifact" class="space-y-4">
        <div>
          <label class="block text-gray-300 mb-1">Nome</label>
          <input v-model="newArtifact.name" type="text" required class="w-full bg-gray-700 text-white rounded p-2" />
        </div>
        <div>
          <label class="block text-gray-300 mb-1">Raridade</label>
          <select v-model="newArtifact.rarity" required class="w-full bg-gray-700 text-white rounded p-2">
            <option value="COMMON">Comum</option>
            <option value="RARE">Raro</option>
            <option value="LEGENDARY">Lendário</option>
            <option value="MYTHIC">Mítico</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-300 mb-1">Imagem</label>
          <input type="file" @change="handleFileUpload" required class="text-gray-300" />
        </div>
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Criar Artefato
        </button>
      </form>
    </div>

    <div v-if="adminStore.loading" class="text-white">A carregar...</div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="artifact in adminStore.adminArtifacts" :key="artifact.id" class="bg-gray-800 rounded p-4 border border-gray-700 flex flex-col items-center">
        <img :src="getImageUrl(artifact.image)" alt="Artifact" class="w-24 h-24 object-contain mb-2" />
        <h3 class="text-white font-bold text-center">{{ artifact.name }}</h3>
        <span class="text-xs text-gray-400 mb-2">{{ artifact.rarity }}</span>
        <button @click="deleteArtifact(artifact.id)" class="text-red-400 text-sm hover:underline">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import artifactService from '@/services/artifactService';

const adminStore = useAdminStore();
const showForm = ref(false);
const file = ref<File | null>(null);
const newArtifact = ref({ name: '', rarity: 'COMMON' });

onMounted(() => {
  adminStore.fetchAdminArtifacts();
});

const getImageUrl = (path: string) => artifactService.getImageUrl(path);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) file.value = target.files[0];
};

const createArtifact = async () => {
  if (!file.value) return;
  
  const formData = new FormData();
  formData.append('name', newArtifact.value.name);
  formData.append('rarity', newArtifact.value.rarity);
  formData.append('image', file.value);

  await adminStore.createArtifactAction(formData);
  showForm.value = false;
  newArtifact.value = { name: '', rarity: 'COMMON' };
  file.value = null;
};

const deleteArtifact = async (id: string) => {
  if (confirm('Tem a certeza? Isto não pode ser desfeito.')) {
    await adminStore.deleteArtifactAction(id);
  }
};
</script>