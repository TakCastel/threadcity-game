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
        class="relative flex items-center justify-center"
        :class="getTerrainClass(cell.terrain)"
        :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
        @click="placeBuilding(index)"
      >
        <!-- Affichage des arbres -->
        <Icon v-if="cell.item === 'tree'" name="fluent-emoji:deciduous-tree" class="absolute inset-0 w-full h-full" />
        <Icon v-if="cell.item === 'palm'" name="fluent-emoji:palm-tree" class="absolute inset-0 w-full h-full" />
        <Icon v-if="cell.item === 'pine'" name="fluent-emoji:evergreen-tree" class="absolute inset-0 w-full h-full" />
        
        <!-- Affichage des bâtiments placés -->
        <Icon v-if="cell.item === 'hut'" name="fluent-emoji:hut" class="absolute w-3/4 h-3/4" />
        <Icon v-if="cell.item === 'factory'" name="fluent-emoji:factory" class="absolute w-full h-full" />
        <Icon v-if="cell.item === 'market'" name="fluent-color:building-store-20" class="absolute w-3/4 h-3/4" />
        <Icon v-if="cell.item === 'seed'" name="fluent-emoji:seedling" class="absolute w-3/4 h-3/4" />
        <Icon v-if="cell.item === 'sapling'" name="fluent-emoji:herb" class="absolute w-3/4 h-3/4" />
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
});


const gridStore = useGridStore();
const cellSize = 50;

// 📌 Charger le monde au démarrage
onMounted(() => {
  gridStore.initWorld();
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

const placeBuilding = (index) => {
  const x = index % gridStore.size;
  const y = Math.floor(index / gridStore.size);
  gridStore.placeBuilding(x, y);
};

</script>

