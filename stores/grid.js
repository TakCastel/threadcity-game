import { defineStore } from 'pinia';

export const useGridStore = defineStore('grid', {
  state: () => ({
    size: 20, // Taille de la grille
    world: [], // Contiendra les données de la grille
    selectedBuilding: null, // 🔹 Stocke le bâtiment en cours de placement

     // 📌 Mise à jour des coûts de construction
     buildingCosts: {
      hut: { wood: 3, stone: 0, food: 0, gold: 0 },      // 🛖 3 bois
      seed: { wood: 0, stone: 0, food: 0, gold: 1 },      // 🌱 1 or
      sapling: { wood: 0, stone: 0, food: 0, gold: 3 },   // 🌿 3 or
      factory: { wood: 5, stone: 0, food: 0, gold: 0 },   // 🏭 5 bois
      market: { wood: 7, stone: 0, food: 0, gold: 0 },    // 🏪 7 bois
    },
  }),

  actions: {
    // 🌍 Initialisation du monde (chargement ou génération)
    initWorld() {
      const savedWorld = localStorage.getItem("grid_world");

      if (savedWorld) {
        this.world = JSON.parse(savedWorld);
        console.log("🌍 Carte chargée depuis localStorage !");
      } else {
        this.generateWorld();
        this.saveWorld();
        console.log("🆕 Nouvelle carte générée !");
      }
    },

    canAffordBuilding(building) {
      const cost = this.buildingCosts[building];
      const resourceStore = useResourceStore();

      return (
        resourceStore.wood >= cost.wood &&
        resourceStore.stone >= cost.stone &&
        resourceStore.food >= cost.food &&
        resourceStore.gold >= cost.gold
      );
    },

    payForBuilding(building) {
      const cost = this.buildingCosts[building];
      const resourceStore = useResourceStore();

      resourceStore.removeResource("wood", cost.wood);
      resourceStore.removeResource("stone", cost.stone);
      resourceStore.removeResource("food", cost.food);
      resourceStore.removeResource("gold", cost.gold);
    },

    // 🏗️ Placer un bâtiment si les ressources sont suffisantes
    placeBuilding(x, y) {
      const index = y * this.size + x;
      const resourceStore = useResourceStore();

      if (!this.selectedBuilding) return;
      if (this.world[index].terrain === "water") {
        console.log("🚫 Impossible de construire sur l'eau !");
        return;
      }
      if (this.world[index].item !== "empty") {
        console.log("🚧 Cette case est déjà occupée !");
        return;
      }
      if (!this.canAffordBuilding(this.selectedBuilding)) {
        console.log("❌ Pas assez de ressources !");
        return;
      }

      this.payForBuilding(this.selectedBuilding); // 🔹 Retirer les ressources
      this.world[index].item = this.selectedBuilding;
      this.selectedBuilding = null;
      this.saveWorld();
    },

    // 🌎 Génération d'une nouvelle carte
    generateWorld() {
      this.world = Array.from({ length: this.size * this.size }, () => ({
        item: "empty",
        cooldown: 0,
        terrain: "plains",
      }));

      this.createRiver();
      this.placeBeaches();
      this.placeTrees();
      this.saveWorld();
    },

    // 🌊 Génération de rivières logiques
    createRiver() {
      let x = Math.floor(Math.random() * this.size * 0.7) + Math.floor(this.size * 0.15);
      let y = 0;

      for (let i = 0; i < this.size * 1.2; i++) {
        const index = y * this.size + x;
        if (index >= 0 && index < this.world.length) {
          this.world[index].terrain = "water";

          if (Math.random() > 0.2 && x > 0) this.world[y * this.size + (x - 1)].terrain = "water";
          if (Math.random() > 0.2 && x < this.size - 1) this.world[y * this.size + (x + 1)].terrain = "water";
          if (Math.random() > 0.85) {
            if (x > 1) this.world[y * this.size + (x - 2)].terrain = "water";
            if (x < this.size - 2) this.world[y * this.size + (x + 2)].terrain = "water";
          }
        }

        const move = Math.random();
        if (move < 0.3 && x > 1) x--;
        else if (move < 0.6 && x < this.size - 2) x++;
        else if (move < 0.8 && y < this.size - 2) y++;
        else y++;

        if (y >= this.size) break;
      }
    },

    // 🏝️ Ajout automatique des plages autour des rivières
    placeBeaches() {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const index = y * this.size + x;
          if (this.world[index].terrain === "water") {
            this.addSandIfValid(x - 1, y);
            this.addSandIfValid(x + 1, y);
            this.addSandIfValid(x, y - 1);
            this.addSandIfValid(x, y + 1);
          }
        }
      }
    },

    addSandIfValid(x, y) {
      if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
        const index = y * this.size + x;
        if (this.world[index].terrain === "plains") {
          this.world[index].terrain = "sand";
        }
      }
    },

    // 🌲🌴 Ajout des arbres selon le terrain
    placeTrees() {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const index = y * this.size + x;
          const terrain = this.world[index].terrain;

          if (terrain === "plains" && Math.random() < 0.1) {
            this.world[index].item = "tree"; // 🌳 Arbres classiques
          }

          if (terrain === "sand" && Math.random() < 0.15) {
            this.world[index].item = "palm"; // 🌴 Cocotiers sur le sable
          }

          if (terrain === "plains" && this.isFarFromWater(x, y) && Math.random() < 0.08) {
            this.world[index].item = "pine"; // 🌲 Pins loin de l’eau
          }
        }
      }
    },

    isFarFromWater(x, y) {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
            const index = ny * this.size + nx;
            if (this.world[index].terrain === "water") return false;
          }
        }
      }
      return true;
    },

    // 📥 Chargement du monde
    loadWorld() {
      const savedWorld = localStorage.getItem("grid_world");
      if (savedWorld) {
        this.world = JSON.parse(savedWorld);
        console.log("🌍 Carte restaurée !");
      } else {
        this.generateWorld();
        this.saveWorld();
        console.log("🆕 Nouvelle carte générée !");
      }
    },

    // 💾 Sauvegarde du monde
    saveWorld() {
      localStorage.setItem("grid_world", JSON.stringify(this.world));
    },
  },
});
