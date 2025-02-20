<template>
    <Grid />
    <ResourceDisplay />
    
    <div class="fixed z-50 bottom-4 right-4 flex flex-col gap-3">
      <Bulldozer />
      <ResetButton />
    </div>
    <BuildingMenu />
  </template>
  
  <script setup>
  import Grid from '@/components/Grid.vue';
  import ResourceDisplay from '@/components/ResourceDisplay.vue';
  import BuildingMenu from '@/components/BuildingMenu.vue';
  </script>
  