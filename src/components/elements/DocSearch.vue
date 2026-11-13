<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { useHashNavigation } from "@/composables/useHashNavigation";
import { indexSections, searchSections, type DocSection, type SearchResult } from "@/utils/docSearch";

const props = defineProps<{
  /** Element whose sections are searched. */
  content: HTMLElement | null;
}>();

const emit = defineEmits<{
  navigate: [];
}>();

const uid = useId();
const inputId = `${uid}-input`;
const listboxId = `${uid}-results`;
const optionId = (index: number) => `${uid}-option-${index}`;

const query = ref("");
const open = ref(false);
const activeIndex = ref(-1);
let sections: DocSection[] | null = null;
const navigateTo = useHashNavigation();

// Indexed on first use: the content element is a template ref of the parent, which is
// only set after mount, and searching may never happen.
function indexedSections(): DocSection[] {
  if (!sections) {
    if (!props.content) {
      throw new Error("DocSearch has no content element to index");
    }
    sections = indexSections(props.content);
  }
  return sections;
}

const results = computed(() =>
  query.value.trim() ? searchSections(indexedSections(), query.value) : []
);
const expanded = computed(() => open.value && query.value.trim() !== "");
const status = computed(() => {
  if (!expanded.value) return "";
  const count = results.value.length;
  if (count === 0) return "No results";
  return count === 1 ? "1 result" : `${count} results`;
});
const activeDescendant = computed(() =>
  expanded.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
);

watch(query, () => {
  activeIndex.value = -1;
  open.value = true;
});

function move(step: number) {
  const count = results.value.length;
  if (count === 0) return;
  open.value = true;
  activeIndex.value = (activeIndex.value + step + count) % count;
}

function clear() {
  query.value = "";
  open.value = false;
}

function select(result: SearchResult | undefined) {
  if (!result) return;
  clear();
  emit("navigate");
  navigateTo(`#${result.id}`).catch((error: unknown) => console.error(error));
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      move(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      move(-1);
      break;
    case "Enter":
      event.preventDefault();
      select(results.value[Math.max(activeIndex.value, 0)]);
      break;
    case "Escape":
      if (query.value) {
        event.preventDefault();
        clear();
      }
      break;
  }
}
</script>

<template>
  <div class="doc-search">
    <label :for="inputId" class="visually-hidden">Search the documentation</label>
    <i class="mdi mdi-magnify search-icon" aria-hidden="true"></i>
    <input
      :id="inputId"
      v-model="query"
      class="search-input"
      type="search"
      placeholder="Search docs"
      autocomplete="off"
      spellcheck="false"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="expanded"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      @keydown="onKeydown"
      @focus="open = true"
      @blur="open = false"
    />
    <ul v-show="expanded && results.length" :id="listboxId" class="search-results" role="listbox" aria-label="Search results">
      <li
        v-for="(result, index) in results"
        :id="optionId(index)"
        :key="result.id"
        role="option"
        :aria-selected="index === activeIndex"
        :class="{ active: index === activeIndex }"
        @mousedown.prevent
        @click="select(result)"
        @mousemove="activeIndex = index"
      >
        <span class="result-heading">{{ result.heading }}</span>
        <span v-if="result.snippet" class="result-snippet">{{ result.snippet }}</span>
      </li>
    </ul>
    <p v-if="expanded && !results.length" class="search-empty" aria-hidden="true">No results</p>
    <p class="visually-hidden" role="status">{{ status }}</p>
  </div>
</template>

<style scoped>
.doc-search {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  top: 1.1rem;
  left: 0.6rem;
  transform: translateY(-50%);
  color: var(--color-text-subtle);
  font-size: 1.1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.45rem 0.75rem 0.45rem 2rem;
  font-size: 0.9rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border-input);
  border-radius: 6px;
}

.search-input:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
  border-color: var(--color-accent);
}

/* In the flow instead of a dropdown: the scrolling sidebar would clip an overlay. */
.search-results,
.search-empty {
  margin: 0.25rem 0 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 8px 24px var(--color-shadow);
}

.search-results {
  list-style: none;
  padding: 0.25rem;
  max-height: 60vh;
  overflow-y: auto;
}

.search-results li {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.search-results li.active {
  background: var(--color-accent-soft);
}

.result-heading {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-accent);
}

.result-snippet {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--color-text-muted);
}

.search-empty {
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
</style>
