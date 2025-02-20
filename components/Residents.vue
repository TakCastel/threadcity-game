<template>
  <transition-group name="resident">
    <div
      v-for="(resident, index) in residents"
      :key="resident.id"
      class="resident absolute"
      :style="{ top: `${resident.y * cellSize + 16}px`, left: `${resident.x * cellSize + 16}px` }"
    >
      <Icon :name="resident.gender === 'male' ? 'fluent-emoji:man-standing' : 'fluent-emoji:woman-standing'"
            style="font-size: 24px;" />
    </div>
  </transition-group>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useGridStore } from "@/stores/grid";

const gridStore = useGridStore();
const cellSize = 50; // 📌 Taille d'une case de la grille
const residents = ref([]);

// 📌 Générer les habitants en fonction des maisons et bâtiments
const generateResidents = () => {
  residents.value = []; // Réinitialise les habitants

  gridStore.world.forEach((cell, index) => {
    if (["house", "lotissement", "building"].includes(cell.item)) {
      const x = index % gridStore.size;
      const y = Math.floor(index / gridStore.size);
      residents.value.push({
        id: index,
        x: x,
        y: y,
        gender: Math.random() > 0.5 ? "male" : "female",
      });
    }
  });
};

// 📌 Faire bouger les habitants aléatoirement
const moveResidents = () => {
  residents.value.forEach((resident) => {
    const direction = Math.floor(Math.random() * 4); // 0 = haut, 1 = bas, 2 = gauche, 3 = droite

    if (direction === 0 && resident.y > 0) resident.y--;
    else if (direction === 1 && resident.y < gridStore.size - 1) resident.y++;
    else if (direction === 2 && resident.x > 0) resident.x--;
    else if (direction === 3 && resident.x < gridStore.size - 1) resident.x++;
  });
};

// 📌 Initialise les habitants et démarre le mouvement aléatoire
onMounted(() => {
  generateResidents();
  setInterval(() => {
    moveResidents();
  }, 750); // 🔄 Déplacement toutes les 2 secondes
});
</script>

<style scoped>
/* 📌 Positionnement absolu pour se déplacer librement sur la grille */
.resident {
  position: absolute;
  width: 5px; /* Correspond à la taille d'une case */
  height: 5px;
  transition: transform 0.5s linear; /* Ajuste la vitesse du mouvement */
  z-index: 10; /* Toujours au-dessus des autres éléments */
}


/* 📌 Animation d'apparition */
.resident-enter-active,
.resident-leave-active {
  transition: opacity 0.5s;
}
.resident-enter-from,
.resident-leave-to {
  opacity: 0;
}
</style>
