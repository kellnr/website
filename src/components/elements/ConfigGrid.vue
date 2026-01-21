<script setup lang="ts">
</script>

<template>
  <div class="config-grid mt-4">
    <slot></slot>
  </div>
</template>

<style scoped>
.config-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 992px) {
  .config-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
