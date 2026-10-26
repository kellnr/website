<script setup lang="ts">
import { computed } from "vue";

// Renders text with `backtick` spans as inline code.
const props = defineProps<{ text: string }>();

const parts = computed(() => props.text.split("`"));
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <code v-if="i % 2">{{ part }}</code>
    <template v-else>{{ part }}</template>
  </template>
</template>

<style scoped>
code {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #0f172a;
}
</style>
