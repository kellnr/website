<script setup lang="ts">
import { versionId, type MajorGroup } from "@/utils/changelog";
import { isPlainLeftClick } from "@/utils/events";

defineProps<{ groups: MajorGroup[] }>();

const emit = defineEmits<{ navigate: [version: string] }>();

function onClick(event: MouseEvent, version: string) {
  if (!isPlainLeftClick(event)) return;
  event.preventDefault();
  emit("navigate", version);
}
</script>

<template>
  <div class="version-nav">
    <div v-for="group in groups" :key="group.major" class="nav-group">
      <span class="nav-major">Kellnr {{ group.major }}</span>
      <ul class="nav-versions">
        <li v-for="release in group.releases" :key="release.version">
          <a :href="`#${versionId(release.version)}`" @click="onClick($event, release.version)">{{
            release.version
          }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.nav-group + .nav-group {
  margin-top: 1rem;
}

.nav-major {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.nav-versions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-versions a {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.nav-versions a:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.nav-versions a:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
