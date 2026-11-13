<script setup lang="ts">
defineProps<{ href: string }>();
</script>

<template>
  <a :href="href" target="_blank" rel="noopener"><slot /><i class="mdi mdi-open-in-new external-icon" aria-hidden="true"></i><span class="visually-hidden"> (opens in new tab)</span></a>
</template>

<style scoped>
.external-icon {
  margin-left: 0.25rem;
  font-size: 0.875em;
}
</style>
