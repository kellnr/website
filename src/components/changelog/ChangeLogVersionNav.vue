<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import { majorOf, releaseCount, versionId, type MajorGroup } from "@/utils/changelog";
import { isPlainLeftClick } from "@/utils/events";
import { formatMonthYear } from "@/utils/date";
import { revealInContainer } from "@/utils/scroll";

const props = defineProps<{
  groups: MajorGroup[];
  /** Version of the release currently read, e.g. "7.2.0". */
  activeVersion: string | null;
  /** Scrolling ancestor that keeps the active link in view. */
  scrollContainer?: HTMLElement | null;
}>();

const emit = defineEmits<{ navigate: [version: string] }>();

const ACTIVE_LINK_MARGIN = 16;

// The group being read is open, the newest one before reading starts. A group the reader
// opened or closed by hand keeps that state.
const activeMajor = computed(() =>
  props.activeVersion ? majorOf(props.activeVersion) : props.groups[0]?.major
);
const toggled = reactive(new Map<number, boolean>());

function isExpanded(major: number): boolean {
  return toggled.get(major) ?? major === activeMajor.value;
}

function toggle(major: number) {
  toggled.set(major, !isExpanded(major));
}

const list = ref<HTMLElement>();

watch(
  () => props.activeVersion,
  async () => {
    const container = props.scrollContainer;
    if (!container) return;
    await nextTick();
    const active = list.value?.querySelector<HTMLElement>("a.active");
    // A link in a collapsed group has no box; revealing it would scroll the sidebar to the top.
    if (active && active.getClientRects().length > 0) {
      revealInContainer(container, active, "y", ACTIVE_LINK_MARGIN);
    }
  }
);

function onClick(event: MouseEvent, version: string) {
  if (!isPlainLeftClick(event)) return;
  event.preventDefault();
  emit("navigate", version);
}
</script>

<template>
  <div ref="list" class="version-nav">
    <div v-for="group in groups" :key="group.major" class="nav-group">
      <button
        type="button"
        class="nav-major"
        :aria-expanded="isExpanded(group.major)"
        :aria-controls="`versions-${group.major}`"
        @click="toggle(group.major)"
      >
        <i
          class="mdi mdi-chevron-right chevron"
          :class="{ open: isExpanded(group.major) }"
          aria-hidden="true"
        ></i>
        <span class="major-label">Kellnr {{ group.major }}</span>
        <span class="major-count">{{ releaseCount(group.releases.length) }}</span>
      </button>
      <ul v-show="isExpanded(group.major)" :id="`versions-${group.major}`" class="nav-versions">
        <li v-for="release in group.releases" :key="release.version">
          <a
            :href="`#${versionId(release.version)}`"
            :class="{ active: release.version === activeVersion }"
            :aria-current="release.version === activeVersion ? 'location' : undefined"
            @click="onClick($event, release.version)"
          >
            <span class="version">{{ release.version }}</span>
            <time class="date" :datetime="release.date">{{ formatMonthYear(release.date) }}</time>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.nav-group + .nav-group {
  margin-top: 0.25rem;
}

.nav-major {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  min-height: 36px;
  padding: 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: left;
  color: var(--color-text);
  background: none;
  border: 0;
  cursor: pointer;
}

.nav-major:hover .major-label {
  color: var(--color-accent);
}

.nav-major:focus-visible,
.nav-versions a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

.chevron {
  font-size: 1.1rem;
  color: var(--color-text-subtle);
  transition: transform 0.15s ease;
}

.chevron.open {
  transform: rotate(90deg);
}

.major-count {
  margin-left: auto;
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--color-text-subtle);
}

.nav-versions {
  margin: 0.125rem 0 0.5rem;
  padding: 0 0 0 0.5rem;
  list-style: none;
}

.nav-versions a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  border-left: 2px solid var(--color-border);
}

.nav-versions a:hover {
  color: var(--color-accent);
}

.nav-versions a.active {
  font-weight: 600;
  color: var(--color-accent);
  border-left-color: var(--color-accent);
}

.version {
  font-variant-numeric: tabular-nums;
}

.date {
  font-size: 0.8rem;
  color: var(--color-text-subtle);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .chevron {
    transition: none;
  }
}
</style>
