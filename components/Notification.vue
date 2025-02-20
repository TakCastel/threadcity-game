<template>
    <div class="fixed top-4 right-4 z-10 flex flex-col items-center space-y-2">
      <transition-group name="fade" mode="out-in">
        <div v-for="notif in notificationStore.notifications" :key="notif.id" 
             class="notification" :class="getNotificationClass(notif.type)">
          {{ notif.message }}
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { useNotificationStore } from "@/stores/notification";
  
  const notificationStore = useNotificationStore();
  
  // 📌 Détermine la couleur selon le type de notification
  const getNotificationClass = (type) => {
    return {
      "bg-green-500 text-white": type === "success",
      "bg-yellow-500 text-black": type === "warning",
      "bg-red-500 text-white": type === "error",
      "bg-blue-500 text-white": type === "info",
    };
  };
  </script>
  
  <style scoped>
  .notification {
    @apply px-4 py-2 rounded-lg shadow-md;
    animation: fadeInOut 3s ease-in-out;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  </style>
  