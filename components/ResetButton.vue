<template>
  <div>
    <!-- Bouton bulldozer (Premium Look) -->
    <button
      @click="showModal = true"
      class="fixed bottom-4 right-4 flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-lg border border-gray-300 text-gray-800 rounded-xl shadow-lg transition hover:bg-white hover:shadow-xl"
    >
      <Icon name="mdi:bulldozer" style="color: #333; font-size: 32px;" />
    </button>

    <!-- Modale de confirmation -->
    <div v-if="showModal" class="fixed z-30 inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-xl w-[90%] md:w-96 p-6 border border-gray-200">
        <p class="text-gray-800 text-lg font-medium text-center mb-6">
          Êtes-vous sûr de vouloir tout recommencer ?<br />Cette action est irréversible.
        </p>
        <div class="flex justify-center gap-4">
          <button @click="resetMap" class="px-6 py-3 bg-red-600 text-white rounded-xl shadow-md transition hover:bg-red-500">
            Oui
          </button>
          <button @click="showModal = false" class="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl border border-gray-300 shadow-md transition hover:bg-gray-200">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGridStore } from '@/stores/grid';
import { useResourceStore } from '@/stores/resources'; // 🔹 Ajout du store des ressources

const gridStore = useGridStore();
const resourceStore = useResourceStore();
const showModal = ref(false);

const resetMap = () => {
  gridStore.generateWorld();
  gridStore.saveWorld();

  // 📌 Réinitialisation des ressources
  resourceStore.$reset();
  resourceStore.saveResources();

  showModal.value = false;
};
</script>
