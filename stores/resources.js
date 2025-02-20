import { defineStore } from 'pinia';
import { useGridStore } from '@/stores/grid'; // 🔹 Import du store de la grille

export const useResourceStore = defineStore('resources', {
  state: () => ({
    wood: 100,
    stone: 50,
    food: 75,
    gold: 20,
    manufacturedGoods: 0, // ⚙️ Produits manufacturés
    luxuryGoods: 0, // 👜 Produits de luxe
  }),

  actions: {
    addResource(type, amount) {
      if (this[type] !== undefined) {
        this[type] += amount;
        this.saveResources();
      }
    },

    removeResource(type, amount) {
      if (this[type] !== undefined) {
        this[type] = Math.max(0, this[type] - amount); // 🔹 Bloque à 0 au lieu de négatif
        this.saveResources();
      }
    },

    saveResources() {
      localStorage.setItem("player_resources", JSON.stringify(this.$state));
    },

    loadResources() {
      const savedResources = localStorage.getItem("player_resources");
      if (savedResources) {
        this.$patch(JSON.parse(savedResources));
      }
    },

    startEconomy() {
      setInterval(() => {
        this.updateEconomy();
      }, 10000); // 🔄 Mise à jour toutes les 5 secondes
    },

    updateEconomy() {
      const gridStore = useGridStore();
    
      // 📌 Initialisation des compteurs
      let houseCount = 0, lotissementCount = 0, buildingCount = 0;
      let factoryCount = 0, industryCount = 0, storeCount = 0;
    
      // 📌 Compter les bâtiments
      gridStore.world.forEach(cell => {
        if (!cell || !cell.item) return; // 🔹 Évite les erreurs sur undefined
    
        if (cell.item === "house") houseCount++;
        if (cell.item === "lotissements") lotissementCount++;
        if (cell.item === "buildings") buildingCount++;
        if (cell.item === "factory") factoryCount++;
        if (cell.item === "industry") industryCount++;
        if (cell.item === "store") storeCount++;
      });
    
      // 📌 Appliquer les effets économiques
      this.addResource("gold", houseCount * 1);
      this.removeResource("food", houseCount * 1);
    
      this.addResource("gold", lotissementCount * 5);
      this.removeResource("food", lotissementCount * 2);
    
      this.addResource("gold", buildingCount * 10);
      this.removeResource("food", buildingCount * 4);
    
      this.addResource("manufacturedGoods", factoryCount * 3);
      this.removeResource("gold", factoryCount * 1);
    
      this.addResource("stone", industryCount * 3);
      this.removeResource("manufacturedGoods", industryCount * 5);
    
      this.addResource("gold", storeCount * 3);
      this.removeResource("luxuryGoods", storeCount * 1);
    
      console.log(`🔄 Économie mise à jour !
        🏠 Maisons: ${houseCount}, 🏘️ Lotissements: ${lotissementCount}, 🏢 Immeubles: ${buildingCount}
        🏭 Usines: ${factoryCount}, 🏗️ Industries: ${industryCount}, 🏪 Magasins: ${storeCount}`);
    }    
  },
});
