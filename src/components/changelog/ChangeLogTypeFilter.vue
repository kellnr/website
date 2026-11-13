<script setup lang="ts">
import type { ChangeLogEntryType } from "@/types/changelog";
import { ENTRY_TYPES } from "@/utils/changelog";

const props = defineProps<{
  selected: ChangeLogEntryType[];
  counts: Record<ChangeLogEntryType, number>;
}>();

const emit = defineEmits<{ change: [types: ChangeLogEntryType[]] }>();

function toggle(type: ChangeLogEntryType) {
  const next = props.selected.includes(type)
    ? props.selected.filter((t) => t !== type)
    : [...props.selected, type];
  emit("change", next);
}
</script>

<template>
  <div class="types" role="group" aria-label="Filter entries by type">
    <button
      type="button"
      class="chip"
      :aria-pressed="selected.length === 0"
      @click="emit('change', [])"
    >
      All
    </button>
    <button
      v-for="type in ENTRY_TYPES"
      :key="type"
      type="button"
      class="chip"
      :aria-pressed="selected.includes(type)"
      @click="toggle(type)"
    >
      {{ type }}
      <span class="chip-count">{{ counts[type] }}</span>
    </button>
  </div>
</template>

<style scoped>
/* Same look as the topic chips on the blog page. */
.types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.chip:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.chip[aria-pressed="true"] {
  color: var(--color-accent-contrast);
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.chip-count {
  min-width: 1.5rem;
  padding: 0 0.375rem;
  font-size: 0.8rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-surface-raised);
  border-radius: 999px;
}

.chip[aria-pressed="true"] .chip-count {
  color: var(--color-accent);
  background: var(--color-accent-contrast);
}

.chip:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .chip {
    transition: none;
  }
}
</style>
