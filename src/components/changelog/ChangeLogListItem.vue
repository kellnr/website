<script setup lang="ts">
import type { ChangeLogEntryType } from "@/types/changelog";

defineProps<{
  type: ChangeLogEntryType;
  breaking?: boolean;
}>();
</script>

<template>
  <li class="entry" :data-type="type">
    <span class="tags">
      <span class="type">{{ type }}</span>
      <span v-if="breaking" class="breaking">Breaking</span>
    </span>
    <span class="content prose-links"><slot></slot></span>
  </li>
</template>

<style scoped>
.entry {
  display: flex;
  gap: 0.75rem;
  padding: 0.375rem 0;
  line-height: 1.6;
  color: var(--color-text);
}

.tags {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  flex: 0 0 6.25rem;
  padding-top: 0.125rem;
}

.type,
.breaking {
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.6;
  border-radius: 4px;
}

.type {
  color: var(--color-text);
  background: var(--color-surface-raised);
}

.breaking {
  color: var(--color-danger);
  background: var(--color-danger-soft);
  border: 1px solid color-mix(in srgb, var(--color-danger) 40%, transparent);
}

.content {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 576px) {
  .entry {
    flex-direction: column;
    gap: 0.25rem;
  }

  .tags {
    flex-direction: row;
    flex-basis: auto;
  }
}
</style>
