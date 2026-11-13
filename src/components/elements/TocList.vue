<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { useHashNavigation } from "@/composables/useHashNavigation";
import { isPlainLeftClick } from "@/utils/events";
import { revealInContainer } from "@/utils/scroll";

export interface TocItem {
  label: string;
  hash: string;
  children?: TocItem[];
}

const props = defineProps<{
  items: TocItem[];
  activeHash: string | null;
  /** Scrollable ancestor that keeps the active link in view. */
  scrollContainer?: HTMLElement | null;
}>();

const emit = defineEmits<{
  navigate: [];
}>();

const ACTIVE_LINK_MARGIN = 16;

const list = ref<HTMLElement | null>(null);
const navigateTo = useHashNavigation();

function onClick(event: MouseEvent, hash: string) {
  if (!isPlainLeftClick(event)) return;
  event.preventDefault();
  emit("navigate");
  navigateTo(hash).catch((error: unknown) => console.error(error));
}

watch(
  () => props.activeHash,
  async () => {
    const container = props.scrollContainer;
    if (!container) return;
    await nextTick();
    const active = list.value?.querySelector<HTMLElement>("a.active");
    if (active) {
      revealInContainer(container, active, "y", ACTIVE_LINK_MARGIN);
    }
  }
);
</script>

<template>
  <ul ref="list" class="toc-list">
    <li v-for="item in items" :key="item.hash">
      <a
        :href="item.hash"
        :class="{ active: item.hash === activeHash }"
        :aria-current="item.hash === activeHash ? 'location' : undefined"
        @click="onClick($event, item.hash)"
        >{{ item.label }}</a
      >
      <ul v-if="item.children">
        <li v-for="child in item.children" :key="child.hash">
          <a
            :href="child.hash"
            :class="{ active: child.hash === activeHash }"
            :aria-current="child.hash === activeHash ? 'location' : undefined"
            @click="onClick($event, child.hash)"
            >{{ child.label }}</a
          >
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 0.25rem;
}

.toc-list a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: 0.25rem 0 0.25rem 0.5rem;
  border-left: 2px solid transparent;
  transition: color 0.2s ease;
}

.toc-list a:hover {
  color: var(--color-accent);
}

.toc-list ul {
  list-style: none;
  padding-left: 1rem;
  margin: 0;
}

.toc-list ul a {
  font-size: 0.85rem;
  color: var(--color-text-subtle);
}

.toc-list ul a:hover {
  color: var(--color-accent);
}

.toc-list a.active {
  color: var(--color-accent);
  font-weight: 600;
  border-left-color: var(--color-accent);
}
</style>
