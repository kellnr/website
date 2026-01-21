<script setup lang="ts">
defineProps<{
  title: string;
  toml: string;
  envVar: string;
  defaultValue: string;
  description: string;
}>();
</script>

<template>
  <div class="config-card">
    <div class="config-header">
      <span class="config-title">{{ title }}</span>
    </div>
    <div class="config-body">
      <div class="config-row">
        <span class="config-label">TOML</span>
        <code class="config-toml"><span class="toml-section">{{ toml.split('] ')[0] }}]</span><br>{{ toml.split('] ')[1] }}</code>
      </div>
      <div class="config-row">
        <span class="config-label">Env Variable</span>
        <code class="config-env">{{ envVar }}</code>
      </div>
      <div class="config-row">
        <span class="config-label">Default</span>
        <code class="config-default">{{ defaultValue || '—' }}</code>
      </div>
      <div class="config-row">
        <span class="config-label">Description</span>
        <span class="config-desc">{{ description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
}

.config-header {
  background: #2f55d4;
  padding: 0.6rem 1rem;
}

.config-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.config-body {
  padding: 0.75rem 1rem;
}

.config-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.config-row:last-child {
  margin-bottom: 0;
}

.config-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #6c757d;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.config-toml {
  font-size: 0.85rem;
  color: #e83e8c;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  line-height: 1.4;
}

.toml-section {
  color: #6c757d;
}

.config-env {
  font-size: 0.8rem;
  color: #495057;
  word-break: break-all;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.config-default {
  font-size: 0.85rem;
  color: #28a745;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.config-desc {
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .config-row {
    flex-direction: row;
    align-items: flex-start;
  }

  .config-label {
    min-width: 100px;
    margin-bottom: 0;
    padding-top: 0.25rem;
  }
}
</style>
