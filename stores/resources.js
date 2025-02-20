import { defineStore } from 'pinia';
import { useGridStore } from '@/stores/grid'; // 🔹 Import du store de la grille

export const useResourceStore = defineStore('resources', {
  state: () => ({
    wood: 20,
    stone: 0,
    food: 100,
    gold: 0,
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
    
      // 📌 Initialisation des compteurs pour chaque type de bâtiment
      const buildingsCount = {
        house: 0,       // 🏠 Maisons
        lotissements: 0, // 🏘️ Lotissements
        building: 0,    // 🏢 Immeubles
        factory: 0,     // 🏭 Usines
        industries: 0,    // 🏗️ Industries
        market: 0        // 🏪 Magasins
      };
    
      // 📌 Compter le nombre de chaque bâtiment sur la carte
      gridStore.world.forEach(cell => {
        if (!cell || !cell.item) return; // 🔹 Évite les erreurs si `cell` est undefined ou vide
        if (buildingsCount.hasOwnProperty(cell.item)) {
          buildingsCount[cell.item]++;
        }
      });
    
      // 📌 Appliquer les effets économiques
    
      // 🏠 **Maisons** → +1 💰 Or / -1 🌽 Nourriture
      this.addResource("gold", buildingsCount.house * 1);
      this.removeResource("food", buildingsCount.house * 1);
    
      // 🏘️ **Lotissements** → +5 💰 Or / -2 🌽 Nourriture
      this.addResource("gold", buildingsCount.lotissements * 2);
      this.removeResource("food", buildingsCount.lotissements * 1);
    
      // 🏢 **Immeubles** → +10 💰 Or / -4 🌽 Nourriture
      this.addResource("gold", buildingsCount.building * 8);
      this.removeResource("food", buildingsCount.building * 4);
    
      // 🏭 **Usines** → +3 ⚙️ Produits Manufacturés / -1 💰 Or
      this.addResource("manufacturedGoods", buildingsCount.factory * 1);
      this.removeResource("gold", buildingsCount.factory * 1);
    
      // 🏗️ **Industries** → +3 🪨 Pierre / -5 ⚙️ Produits Manufacturés
      this.addResource("stone", buildingsCount.industries * 1);
      this.addResource("wood", buildingsCount.industries * 2);
      this.removeResource("gold", buildingsCount.industries * 2);
    
      // 🏪 **Magasins** → +3 💰 Or / -1 👜 Produits de Luxe
      this.addResource("luxuryGoods", buildingsCount.market * 1);
      this.removeResource("gold", buildingsCount.market * 1);
    
      // 📌 Affichage du log en console pour voir l'évolution de l'économie
      console.log(`
        🔄 Économie mise à jour !
        🏠 Maisons: ${buildingsCount.house}, 🏘️ Lotissements: ${buildingsCount.lotissements}, 🏢 Immeubles: ${buildingsCount.building}
        🏭 Usines: ${buildingsCount.factory}, 🏗️ Industries: ${buildingsCount.industries}, 🏪 Magasins: ${buildingsCount.market}
      `);
    }
     
  },
});
