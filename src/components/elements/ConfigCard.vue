<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  toml: string;
  envVar: string;
  defaultValue: string;
  description: string;
}>();

const tomlParts = computed(() => {
  const [section, key] = props.toml.split("] ");
  return { section: `${section}]`, key };
});
</script>

<template>
  <div class="config-card">
    <div class="config-header">
      <span class="config-title">{{ title }}</span>
    </div>
    <div class="config-body">
      <div class="config-row">
        <span class="config-label">TOML</span>
        <code class="config-toml"><span class="toml-section">{{ tomlParts.section }}</span><br>{{ tomlParts.key }}</code>
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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--color-shadow);
  margin-bottom: 1rem;
  overflow: hidden;
}

.config-header {
  background: var(--color-band-solid);
  padding: 0.6rem 1rem;
}

.config-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-band-text);
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
  color: var(--color-text-muted);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.config-toml {
  font-size: 0.85rem;
  color: var(--color-code-inline);
  background: var(--color-surface-raised);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  line-height: 1.4;
}

.toml-section {
  color: var(--color-text-muted);
}

.config-env {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  word-break: break-all;
  background: var(--color-surface-raised);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.config-default {
  font-size: 0.85rem;
  color: var(--color-success);
  background: var(--color-surface-raised);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.config-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
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
