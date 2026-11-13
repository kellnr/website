<script setup lang="ts">
import { computed } from "vue";
import { nextTheme, useTheme, type Theme } from "@/composables/useTheme";

const { theme, cycle } = useTheme();

const ICONS: Record<Theme, string> = {
  system: "mdi-theme-light-dark",
  light: "mdi-white-balance-sunny",
  dark: "mdi-weather-night",
};

const label = computed(
  () => `Color theme: ${theme.value}. Switch to ${nextTheme(theme.value)}`,
);
</script>

<template>
  <button type="button" class="theme-toggle" :aria-label="label" :title="label" @click="cycle">
    <i class="mdi" :class="ICONS[theme]" aria-hidden="true"></i>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 1.25rem;
  color: var(--color-text-muted);
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.theme-toggle:hover {
  color: var(--color-accent);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
