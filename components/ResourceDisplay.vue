<template>
  <div class="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-md flex space-x-4">
    <div class="flex items-center space-x-2">
      <Icon name="fluent-emoji-high-contrast:wood" style="font-size: 24px;" />
      <span>{{ resourceStore.wood }}</span>
    </div>
    <div class="flex items-center space-x-2">
      <Icon name="fluent-emoji-high-contrast:rock" style="font-size: 24px;" />
      <span>{{ resourceStore.stone }}</span>
    </div>
    <div class="flex items-center space-x-2">
      <Icon name="fluent-emoji-high-contrast:ear-of-corn" style="font-size: 24px;" />
      <span>{{ resourceStore.food }}</span>
    </div>
    <div class="flex items-center space-x-2">
      <Icon name="fluent-emoji-high-contrast:coin" style="font-size: 24px;" />
      <span>{{ resourceStore.gold }}</span>
    </div>
  </div>
</template>

<script setup>
import { useResourceStore } from '@/stores/resources';

const resourceStore = useResourceStore();
</script>
