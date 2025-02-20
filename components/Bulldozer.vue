<template>
  <button 
    @click="toggleBulldozerMode"
    class="flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-lg border border-gray-300 text-gray-800 rounded-xl shadow-lg transition hover:bg-white hover:shadow-xl"
    :class="{ 'bg-red-600 text-white': isBulldozing }"
  >
    <Icon name="mdi:bulldozer" style="font-size: 32px;" />
  </button>

  <div v-if="isBulldozing" class="fixed border border-8 border-red-500 w-full h-full z-10 inset-0 pointer-events-none">

  </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { useGridStore } from '@/stores/grid';
  
  const gridStore = useGridStore();
  const isBulldozing = ref(false);
  
  // 📌 Active/Désactive le mode bulldozer
  const toggleBulldozerMode = () => {
    isBulldozing.value = !isBulldozing.value;
    gridStore.isBulldozing = isBulldozing.value;
  };
  </script>
  
  <style scoped>
  .bulldozer-button {
    @apply p-3 rounded-lg shadow-md transition;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .active {
    @apply bg-red-600;
  }
  </style>
  