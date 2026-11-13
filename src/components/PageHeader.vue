<script setup lang="ts">
export interface Crumb {
  label: string;
  to?: string;
}

defineProps<{
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
}>();
</script>

<template>
  <section class="page-header">
    <div class="container">
      <nav v-if="breadcrumbs?.length" aria-label="breadcrumb">
        <ol class="crumbs">
          <li v-for="crumb in breadcrumbs" :key="crumb.label">
            <router-link v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</router-link>
            <span v-else aria-current="page">{{ crumb.label }}</span>
          </li>
        </ol>
      </nav>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle || $slots.subtitle" class="page-subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
  </section>
</template>

<style scoped>
.page-header {
  padding: 2rem 0 1.75rem;
  background: var(--gradient-page-header);
  border-bottom: 1px solid var(--color-border);
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  list-style: none;
  margin: 0 0 0.5rem;
  padding: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.crumbs li + li::before {
  content: "/";
  margin-right: 0.375rem;
  color: var(--color-border-strong);
}

.crumbs a {
  color: var(--color-text-muted);
}

.crumbs a:hover {
  color: var(--color-accent);
}

.page-title {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
}

.page-subtitle {
  margin: 0.5rem 0 0;
  max-width: 720px;
  font-size: 1.1rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
}
</style>
