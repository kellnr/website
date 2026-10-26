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
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<style scoped>
.page-header {
  padding: 2rem 0 1.75rem;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  border-bottom: 1px solid #e2e8f0;
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
  color: #64748b;
}

.crumbs li + li::before {
  content: "/";
  margin-right: 0.375rem;
  color: #cbd5e1;
}

.crumbs a {
  color: #64748b;
}

.crumbs a:hover {
  color: #2f55d4;
}

.page-title {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: #0f172a;
}

.page-subtitle {
  margin: 0.5rem 0 0;
  max-width: 720px;
  font-size: 1.1rem;
  color: #475569;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
}
</style>
