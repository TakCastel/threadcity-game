<template>
  <div class="fixed top-4 left-4 mr-4 ">
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-wrap space-x-4">
      <div class="flex items-center space-x-2" :class="{ 'resource-decrease': decreasing.wood, 'resource-increase': increasing.wood }">
        <Icon name="fluent-emoji:wood" style="font-size: 24px;" />
        <span>{{ resourceStore.wood }}</span>
      </div>

      <div class="flex items-center space-x-2" :class="{ 'resource-decrease': decreasing.stone, 'resource-increase': increasing.stone }">
        <Icon name="fluent-emoji:rock" style="font-size: 24px;" />
        <span>{{ resourceStore.stone }}</span>
      </div>
      <div class="flex items-center space-x-2" :class="{ 'resource-decrease': decreasing.food, 'resource-increase': increasing.food }">
        <Icon name="fluent-emoji:ear-of-corn" style="font-size: 24px;" />
        <span>{{ resourceStore.food }}</span>
      </div>
      <div class="flex items-center space-x-2" :class="{ 'resource-decrease': decreasing.manufacturedGoods, 'resource-increase': increasing.manufacturedGoods }">
        <Icon name="fluent-emoji:gear" style="font-size: 24px;" />
        <span>{{ resourceStore.manufacturedGoods }}</span>
      </div>
      <div class="flex items-center space-x-2" :class="{ 'resource-decrease': decreasing.luxuryGoods, 'resource-increase': increasing.luxuryGoods }">
        <Icon name="fluent-emoji:handbag" style="font-size: 24px;" />
        <span>{{ resourceStore.luxuryGoods }}</span>
      </div>
      <div class="flex items-center space-x-2" :class="{ 'resource-decrease': decreasing.gold, 'resource-increase': increasing.gold }">
        <Icon name="fluent-emoji:coin" style="font-size: 24px;" />
        <span>{{ resourceStore.gold }}</span>
      </div>
    </div>

    <!-- 📌 Affichage du score -->
    <div class="absolute -bottom-8 left-0 flex gap-2">
      <div class="text-xs bg-white px-2 py-1 rounded-lg shadow-md">
        Score : {{ formattedScore }}
      </div>
  
      <!-- 📌 Affichage du bonheur -->
      <div class="text-xs bg-white px-2 py-1 rounded-lg shadow-md">
        Bonheur : {{ resourceStore.happiness }}
      </div>
    </div>
  </div>

  <!-- 🚨 GAME OVER - MODALE BLOQUANTE -->
  <div v-if="resourceStore.gameOver" class="game-over-modal">
    <div class="game-over-content">
      <p class="text-xl">GAME OVER</p>
      <p class="text-md">Total : {{ resourceStore.finalScore }}</p>
      <button @click="restartGame">Recommencer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useResourceStore } from '@/stores/resources';

const resourceStore = useResourceStore();

const decreasing = ref({ 
  wood: false, 
  stone: false, 
  food: false, 
  gold: false, 
  manufacturedGoods: false, 
  luxuryGoods: false 
});

const increasing = ref({ 
  wood: false, 
  stone: false, 
  food: false, 
  gold: false, 
  manufacturedGoods: false, 
  luxuryGoods: false 
});

// 📌 Formate le score avec des zéros devant (ex: "0000123")
const formattedScore = computed(() => {
  return resourceStore.score.toString().padStart(10, "0");
});

const restartGame = () => {
  localStorage.clear(); // Supprime toutes les données stockées
  window.location.reload(); // Recharge la page
};

// 📌 Détecte une diminution ou augmentation des ressources et active l'animation
const trackResourceChange = (resource) => {
  watch(() => resourceStore[resource], (newVal, oldVal) => {
    if (newVal < oldVal) {
      triggerAnimation(decreasing, resource);
    } else if (newVal > oldVal) {
      triggerAnimation(increasing, resource);
    }
  });
};

// 📌 Ajoute un watcher pour chaque ressource
["wood", "stone", "food", "gold", "manufacturedGoods", "luxuryGoods"].forEach(trackResourceChange);

// 📌 Active l'effet et le désactive après 500ms
const triggerAnimation = (animationType, resource) => {
  animationType.value[resource] = true;
  setTimeout(() => {
    animationType.value[resource] = false;
  }, 500);
};
</script>

<style scoped>
/* 📌 Animation clignotement rouge */
.resource-decrease {
  animation: flash-red 0.5s ease-out;
}

/* 🚨 MODALE GAME OVER - Bloque tout l'écran */
.game-over-modal {
  @apply fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center ml-0;
  z-index: 50;
}

/* 🚨 Contenu du Game Over */
.game-over-content {
  @apply text-white font-bold text-center p-10 bg-gray-800 rounded-lg shadow-xl;
}

/* 🔄 Bouton de redémarrage */
.game-over-content button {
  @apply mt-6 bg-white text-black px-6 py-3 rounded-lg transition hover:bg-gray-300;
}

/* 📌 Animation clignotement vert */
.resource-increase {
  animation: flash-green 0.5s ease-out;
}

@keyframes flash-red {
  0% { color: black; transform: scale(1) }
  25% { color: red; transform: scale(1.1) }
  100% { color: black; transform: scale(1) }
}

@keyframes flash-green {
  0% { color: black; transform: scale(1) }
  25% { color: greenyellow; transform: scale(1.1) }
  100% { color: black; transform: scale(1) }
}
</style>
