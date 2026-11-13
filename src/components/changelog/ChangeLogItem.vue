<script setup lang="ts">
import { computed } from "vue";
import HeadingAnchor from "@/components/elements/HeadingAnchor.vue";
import { formatDate } from "@/utils/date";
import { versionId } from "@/utils/changelog";
import { isPlainLeftClick } from "@/utils/events";

const props = defineProps<{
  version: string;
  date: string;
  isLatest?: boolean;
}>();

const emit = defineEmits<{ navigate: [version: string] }>();

const id = computed(() => versionId(props.version));

function onAnchorClick(event: MouseEvent) {
  if (!isPlainLeftClick(event)) return;
  event.preventDefault();
  emit("navigate", props.version);
}
</script>

<template>
  <article class="release">
    <header class="release-header">
      <h2 :id="id" class="release-title">
        <HeadingAnchor :target-id="id" @click="onAnchorClick"
          >Version <span class="version">{{ version }}</span></HeadingAnchor
        >
      </h2>
      <span v-if="isLatest" class="latest">Latest</span>
      <time class="release-date" :datetime="date">{{ formatDate(date) }}</time>
    </header>
    <ul class="entries">
      <slot></slot>
    </ul>
  </article>
</template>

<style scoped>
.release + .release {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.release-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.75rem;
  margin-bottom: 0.75rem;
}

.release-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text);
  /* Keeps the heading clear of the 64px sticky navigation bar when it is a link target. */
  scroll-margin-top: calc(64px + 1rem);
}

.version {
  color: var(--color-accent);
}

.latest {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border: 1px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
  border-radius: 999px;
}

.release-date {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.entries {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
