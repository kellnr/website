<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from "vue-router";
import CodeText from "@/components/elements/CodeText.vue";

defineProps<{
  icon: string;
  title: string;
  text: string;
  to?: RouteLocationRaw;
}>();
</script>

<template>
  <component :is="to ? RouterLink : 'div'" :to="to" class="feature-card">
    <div class="feature-icon">
      <i class="mdi" :class="icon"></i>
    </div>
    <h3>{{ title }}</h3>
    <p><CodeText :text="text" /></p>
  </component>
</template>

<style scoped>
.feature-card {
  display: block;
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px var(--color-shadow);
}

a.feature-card:hover {
  border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-soft);
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

.feature-icon i {
  font-size: 1.75rem;
  color: var(--color-accent);
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.75rem;
}

.feature-card p {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.6;
}
</style>
