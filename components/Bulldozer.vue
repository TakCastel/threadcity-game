<template>
    <button 
      @click="toggleBulldozerMode"
      class="bulldozer-button bg-gray-300"
      :class="{ 'active': isBulldozing }"
    >
        <Icon name="mdi:bulldozer" style="color: white; font-size: 24px;" />
    </button>
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
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .active {
    @apply bg-red-600;
  }
  </style>
  