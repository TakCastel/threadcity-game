// 📂 stores/notification.js
import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),

  actions: {
    addNotification(message, type = "info") {
      const id = Date.now();
      this.notifications.push({ id, message, type });

      // Supprime la notification après 3 secondes
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 3000);
    },
  },
});
