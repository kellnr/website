<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import ChangeLogItem from "@/components/changelog/ChangeLogItem.vue";
import ChangeLogListItem from "@/components/changelog/ChangeLogListItem.vue";
import ChangeLogTypeFilter from "@/components/changelog/ChangeLogTypeFilter.vue";
import ChangeLogVersionNav from "@/components/changelog/ChangeLogVersionNav.vue";
import blogData from "@/data/blog-posts.json";
import changelogData from "@/data/changelog.json";
import { useHashNavigation } from "@/composables/useHashNavigation";
import { useScrollSpy } from "@/composables/useScrollSpy";
import type { ChangeLogDocument, ChangeLogEntryType } from "@/types/changelog";
import {
  releaseCount,
  countByType,
  entryHtml,
  filterReleases,
  groupByMajor,
  isBreaking,
  majorOf,
  parseTypeFilter,
  serializeTypeFilter,
  UPGRADE_POST_IDS,
  versionId,
  type MajorGroup,
} from "@/utils/changelog";

interface UpgradePost {
  title: string;
  path: string;
}

interface DisplayGroup extends MajorGroup {
  upgradePost: UpgradePost | undefined;
}

const releases = (changelogData as ChangeLogDocument).releases;
const typeCounts = countByType(releases);

function upgradePost(major: number): UpgradePost | undefined {
  const id = UPGRADE_POST_IDS[major];
  if (id === undefined) return undefined;
  const post = blogData.posts.find((p) => p.id === id);
  if (!post) {
    throw new Error(`Upgrade post "${id}" for Kellnr ${major} is missing in blog-posts.json`);
  }
  return { title: post.title, path: new URL(post.url).pathname };
}

const route = useRoute();
const router = useRouter();

const selectedTypes = computed(() => parseTypeFilter(route.query.type));

function selectTypes(types: ChangeLogEntryType[]) {
  router.replace({
    query: { ...route.query, type: serializeTypeFilter(types) },
    hash: route.hash,
  });
}

const groups = computed<DisplayGroup[]>(() =>
  groupByMajor(filterReleases(releases, selectedTypes.value)).map((group) => ({
    ...group,
    upgradePost: upgradePost(group.major),
  }))
);

function majorForHash(hash: string): number | undefined {
  const release = releases.find((r) => `#${versionId(r.version)}` === hash);
  return release ? majorOf(release.version) : undefined;
}

// The newest major starts open, older ones collapsed; a linked release opens its group.
const newestMajor = majorOf(releases[0]!.version);
const openMajors = reactive(new Set<number>([newestMajor]));

function openGroupOf(hash: string) {
  const major = majorForHash(hash);
  if (major !== undefined) openMajors.add(major);
}

openGroupOf(route.hash);
watch(() => route.hash, openGroupOf);

function onToggle(major: number, event: Event) {
  const open = (event.target as HTMLDetailsElement).open;
  if (open) openMajors.add(major);
  else openMajors.delete(major);
}

const navigateToHash = useHashNavigation();

// Releases hidden by a filter or a collapsed group have no position and are skipped.
const releaseIds = releases.map((release) => versionId(release.version));
const activeReleaseId = useScrollSpy(releaseIds);
const activeVersion = computed(
  () => releases.find((release) => versionId(release.version) === activeReleaseId.value)?.version ?? null
);

const versionSidebar = ref<HTMLElement | null>(null);

// Shows the release being read; each change, also per arrow key step, jumps to the choice.
function onJump(event: Event) {
  const version = (event.target as HTMLSelectElement).value;
  if (version) navigateTo(version);
}

function navigateTo(version: string) {
  openMajors.add(majorOf(version));
  navigateToHash(`#${versionId(version)}`).catch((error: unknown) => console.error(error));
}

</script>

<template>
  <div>
    <PageHeader
      title="Changelog"
      :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Changelog' }]"
    />

    <section class="page-content">
      <div class="container">
        <div class="row">
          <aside class="col-lg-3 d-none d-lg-block">
            <nav ref="versionSidebar" class="version-sidebar" aria-labelledby="versions-title">
              <h2 id="versions-title" class="versions-title">Versions</h2>
              <ChangeLogVersionNav
                :groups="groups"
                :active-version="activeVersion"
                :scroll-container="versionSidebar"
                @navigate="navigateTo"
              />
            </nav>
          </aside>

          <div class="col-lg-9">
            <p class="format-note">
              This changelog follows
              <a href="https://keepachangelog.com/en/1.1.0/" target="_blank" rel="noopener noreferrer"
                >Keep a Changelog</a
              >. Releases are also in the <a href="/rss.xml">RSS feed</a>.
            </p>

            <div class="jump-menu d-lg-none">
              <label for="jump-to-version">Jump to version</label>
              <select id="jump-to-version" :value="activeVersion ?? ''" @change="onJump">
                <option value="" disabled>Select a version</option>
                <optgroup v-for="group in groups" :key="group.major" :label="`Kellnr ${group.major}`">
                  <option v-for="release in group.releases" :key="release.version" :value="release.version">
                    {{ release.version }}
                  </option>
                </optgroup>
              </select>
            </div>

            <ChangeLogTypeFilter
              class="type-filter"
              :selected="selectedTypes"
              :counts="typeCounts"
              @change="selectTypes"
            />

            <p v-if="groups.length === 0" class="no-results">No entries match the filter.</p>

            <details
              v-for="group in groups"
              :key="group.major"
              class="major-group"
              :open="openMajors.has(group.major)"
              @toggle="onToggle(group.major, $event)"
            >
              <summary>
                <span class="major-title">Kellnr {{ group.major }}</span>
                <span class="major-count">{{ releaseCount(group.releases.length) }}</span>
              </summary>

              <div class="major-body">
                <router-link
                  v-if="group.upgradePost"
                  :to="group.upgradePost.path"
                  class="upgrade-post"
                >
                  Upgrade guide: {{ group.upgradePost.title }}
                </router-link>

                <ChangeLogItem
                  v-for="release in group.releases"
                  :key="release.version"
                  :version="release.version"
                  :date="release.date"
                  :is-latest="!!release.isLatest"
                  @navigate="navigateTo"
                >
                  <ChangeLogListItem
                    v-for="(entry, idx) in release.entries"
                    :key="`${release.version}-${idx}`"
                    :type="entry.type"
                    :breaking="isBreaking(entry, release.version)"
                  >
                    <span v-if="entry.scope" class="scope">{{ entry.scope }}</span>
                    <span v-html="entryHtml(entry, release.version)"></span>
                  </ChangeLogListItem>
                </ChangeLogItem>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.version-sidebar {
  position: sticky;
  /* Below the 64px sticky navigation bar, aligned with the docs sidebar. */
  top: calc(64px + 1.5rem);
  max-height: calc(100vh - 64px - 3rem);
  overflow-y: auto;
  padding: 1rem;
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.versions-title {
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-accent);
  border-bottom: 2px solid var(--color-accent);
}

.format-note {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.jump-menu {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.jump-menu label {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.jump-menu select {
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  font: inherit;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border-input);
  border-radius: 8px;
}

.jump-menu select:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.type-filter {
  margin-bottom: 2rem;
}

.no-results {
  color: var(--color-text-muted);
}

.major-group {
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.major-group summary {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-radius: 12px;
}

.major-group[open] summary {
  border-bottom: 1px solid var(--color-border);
  border-radius: 12px 12px 0 0;
}

.major-group summary:hover .major-title {
  color: var(--color-accent);
}

.major-group summary:focus-visible,
.upgrade-post:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.major-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
}

.major-count {
  font-size: 0.875rem;
  color: var(--color-text-subtle);
}

.major-body {
  padding: 1.5rem;
}

.upgrade-post {
  display: block;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  background: var(--color-accent-soft);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  border-radius: 8px;
}

.scope {
  display: inline-block;
  margin-right: 0.375rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-text-muted);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  vertical-align: middle;
}

@media (max-width: 576px) {
  .major-group summary,
  .major-body {
    padding: 1rem;
  }
}
</style>
