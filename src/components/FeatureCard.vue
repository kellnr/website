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
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

a.feature-card:hover {
  border-color: #bfdbfe;
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

.feature-icon i {
  font-size: 1.75rem;
  color: #2f55d4;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.75rem;
}

.feature-card p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}
</style>
