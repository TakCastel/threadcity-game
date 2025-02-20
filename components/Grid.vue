<template>
  <div class="w-full h-full overflow-auto">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${gridStore.size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridStore.size}, ${cellSize}px)`,
      }"
    >
      <div
        v-for="(cell, index) in gridStore.world"
        :key="index"
        class="relative flex items-center justify-center hover:opacity-90"
        :class="getTerrainClass(cell.terrain)"
        :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
        @click="handleClick(index)"
      >
        <!-- 🌱 Affichage des plantes en croissance -->
        <Icon v-if="cell.item === 'sapling'" name="fluent-emoji:seedling" class="absolute w-3/4 h-3/4" />
        <Icon v-if="cell.item === 'seed'" name="fluent-emoji:herb" class="absolute w-3/4 h-3/4" />

        <!-- Affichage des arbres -->
        <Icon v-if="cell.item === 'tree'" name="fluent-emoji:deciduous-tree" class="absolute inset-0 w-full h-full cursor-pointer" />
        <Icon v-if="cell.item === 'palm'" name="fluent-emoji:palm-tree" class="absolute inset-0 w-full h-full cursor-pointer" />
        <Icon v-if="cell.item === 'pine'" name="fluent-emoji:evergreen-tree" class="absolute inset-0 w-full h-full cursor-pointer" />
        <Icon v-if="cell.item === 'wheat-field'" name="fluent-emoji:sheaf-of-rice" class="absolute inset-0 w-full h-full cursor-pointer" />
        
        <!-- Affichage des bâtiments placés -->
        <Icon v-if="cell.item === 'house'" name="fluent-emoji:house" class="absolute w-3/4 h-3/4" />
        <Icon v-if="cell.item === 'factory'" name="fluent-emoji:factory" class="absolute w-full h-full" />
        <Icon v-if="cell.item === 'industries'" name="fluent-emoji:building-construction" class="absolute w-full h-full" />
        <Icon v-if="cell.item === 'market'" name="fluent-color:building-store-20" class="absolute w-3/4 h-3/4" />
        <Icon v-if="cell.item === 'lotissements'" name="fluent-emoji:houses" class="absolute w-full h-full" />
        <Icon v-if="cell.item === 'building'" name="fluent-emoji:office-building" class="absolute w-full h-full" />

        <!-- Affichage des montagnes -->
        <Icon v-if="cell.item === 'mountain'" name="fluent-emoji:mountain" class="absolute w-full h-full" />
        <Icon v-if="cell.item === 'snowy-mountain'" name="fluent-emoji:snow-capped-mountain" class="absolute w-full h-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGridStore } from '@/stores/grid';
import { useResourceStore } from '@/stores/resources';
import { onMounted } from 'vue';

const resourceStore = useResourceStore();

onMounted(() => {
  resourceStore.loadResources(); // 📥 Récupère les ressources au chargement
  resourceStore.startEconomy(); // 🔄 Lance l'économie dès le début
});

const gridStore = useGridStore();
const cellSize = 50;

// 📌 Charger le monde au démarrage
onMounted(() => {
  gridStore.initWorld();
  gridStore.startCooldownLoop(); // 🔄 Active la mise à jour automatique du cooldown
});

// 🎨 Couleurs des terrains (style Civ 3)
const getTerrainClass = (terrain) => {
  const styles = {
    plains: "bg-[#91A36C]",  // 🌿 Vert olive doux
    sand: "bg-[#D2B48C]",    // 🏜 Beige terreux
    water: "bg-[#4A81A5]",   // 🌊 Bleu naturel
  };
  return styles[terrain] || "bg-gray-800";
};

// 📌 Gestion du clic : soit on coupe un arbre, soit on place un bâtiment
const handleClick = (index) => {
  const x = index % gridStore.size;
  const y = Math.floor(index / gridStore.size);

  const cell = gridStore.world[index];

    // 🏗️ Si le mode bulldozer est activé, supprimer sauf montagnes
    if (gridStore.isBulldozing) {
      if (["mountain", "snowy-mountain", "palm", "tree", "pine"].includes(cell.item)) {
        console.log("🚧 Impossible de détruire cela !");
        return;
      }
      gridStore.world[index].item = "empty";
      gridStore.saveWorld();
      console.log("🚜 Bulldozer utilisé !");
      return;
    }

  // 🪓 Si c'est un arbre, on le coupe
  if (["tree", "palm", "pine"].includes(cell.item)) {
    gridStore.harvestTree(x, y);
  }  else if (["wheat-field"].includes(cell.item)) {
    gridStore.harvestWheat(x, y);
  } 
  // 🏗️ Sinon, on tente de construire
  else {
    gridStore.placeBuilding(x, y);
  }
};

</script>

