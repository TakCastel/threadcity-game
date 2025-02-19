import { defineStore } from 'pinia';

export const useResourceStore = defineStore('resources', {
  state: () => ({
    wood: 100,
    stone: 50,
    food: 75,
    gold: 20,
  }),

  actions: {
    addResource(type, amount) {
      if (this[type] !== undefined) {
        this[type] += amount;
        this.saveResources(); // 🔹 Sauvegarde après modification
      }
    },

    removeResource(type, amount) {
      if (this[type] !== undefined) {
        if (this[type] >= amount) {
          this[type] -= amount;
          this.saveResources(); // 🔹 Sauvegarde après modification
        } else {
          console.log(`❌ Pas assez de ${type} !`);
        }
      }
    },

    saveResources() {
      localStorage.setItem("player_resources", JSON.stringify(this.$state));
    },

    loadResources() {
      const savedResources = localStorage.getItem("player_resources");
      if (savedResources) {
        this.$patch(JSON.parse(savedResources));
        console.log("🔄 Ressources restaurées !");
      }
    },
  },
});
