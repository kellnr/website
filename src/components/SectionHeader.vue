<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="section-header">
    <h2>{{ title }}</h2>
    <p>{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem;
}

.section-header p {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 1.5rem;
  }
}
</style>
