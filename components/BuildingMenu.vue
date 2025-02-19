<template>
  <div class="fixed bottom-4 left-4 flex space-x-2">
    <!-- Boutons principaux -->
    <button v-for="(category, index) in categories" :key="category.name"
      @click.stop="toggleMenu(category.name, index)"
      class="menu-button"
      :class="category.color"
      ref="buttons"
    >
      <Icon :name="category.icon" style="color: white; font-size: 24px;" />
    </button>
  </div>

  <!-- Sous-menu avec les coûts -->
  <div v-if="activeMenu" class="submenu" :style="{ left: `${submenuPosition}px`, bottom: `${submenuBottom}px` }">
    <button v-for="building in buildings[activeMenu]" :key="building.type"
            @click="selectBuilding(building.type)"
            class="submenu-button"
            :class="{ 'opacity-50': !canAfford(building.type) }">
      <Icon :name="building.icon" style="color: black; font-size: 20px;" />
      <div class="text-xs text-gray-700 mt-1">
        <span v-if="costs[building.type].wood">🌲 {{ costs[building.type].wood }}</span>
        <span v-if="costs[building.type].stone">🪨 {{ costs[building.type].stone }}</span>
        <span v-if="costs[building.type].food">🍞 {{ costs[building.type].food }}</span>
        <span v-if="costs[building.type].gold">💰 {{ costs[building.type].gold }}</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useGridStore } from '@/stores/grid';
import { useResourceStore } from '@/stores/resources';

const gridStore = useGridStore();
const resourceStore = useResourceStore();
const activeMenu = ref(null);
const submenuPosition = ref(0);
const submenuBottom = ref(70);
const buttons = ref([]);

const categories = [
  { name: 'residential', icon: 'fluent:home-24-filled', color: 'bg-green-500 hover:bg-green-400' },
  { name: 'industry', icon: 'fluent:building-factory-24-filled', color: 'bg-yellow-500 hover:bg-yellow-400' },
  { name: 'commerce', icon: 'fluent:store-microsoft-24-filled', color: 'bg-blue-500 hover:bg-blue-400' },
];

const buildings = {
  residential: [{ type: 'hut', icon: 'fluent:home-24-regular' }],
  industry: [
    { type: 'seed', icon: 'fluent:plant-grass-24-regular' },
    { type: 'sapling', icon: 'fluent:leaf-two-24-regular' },
    { type: 'factory', icon: 'fluent:building-factory-24-regular' },
  ],
  commerce: [{ type: 'market', icon: 'fluent:cart-24-regular' }],
};

// 📌 Récupère les coûts des bâtiments
const costs = computed(() => gridStore.buildingCosts);

// 📌 Vérifie si le joueur a assez de ressources
const canAfford = (building) => {
  const cost = costs.value[building];
  return (
    resourceStore.wood >= cost.wood &&
    resourceStore.stone >= cost.stone &&
    resourceStore.food >= cost.food &&
    resourceStore.gold >= cost.gold
  );
};

// 📌 Ouvrir un sous-menu et positionner son apparition
const toggleMenu = async (menu, index) => {
  if (activeMenu.value === menu) {
    activeMenu.value = null;
    return;
  }

  activeMenu.value = menu;
  
  await nextTick();
  if (buttons.value[index]) {
    const buttonRect = buttons.value[index].getBoundingClientRect();
    submenuPosition.value = buttonRect.left;
    submenuBottom.value = window.innerHeight - buttonRect.bottom + 60;
  }
};

// 📌 Sélectionner un bâtiment
const selectBuilding = (type) => {
  if (!costs.value[type]) {
    console.log(`❌ Le bâtiment "${type}" n'a pas de coût défini !`);
    return;
  }

  if (canAfford(type)) {
    gridStore.selectedBuilding = type;
    activeMenu.value = null;
  } else {
    console.log(`❌ Pas assez de ressources pour construire "${type}"`);
  }
};

</script>

<style scoped>
/* 📌 Boutons principaux */
.menu-button {
  @apply p-3 rounded-lg shadow-md transition;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 📌 Sous-menu */
.submenu {
  position: fixed;
  display: flex;
  flex-direction: row;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

/* 📌 Boutons de construction */
.submenu-button {
  @apply bg-gray-100 p-2 rounded-lg shadow hover:bg-gray-200 transition flex flex-col items-center;
  width: 50px;
  height: 60px;
  margin: 4px;
}
</style>
