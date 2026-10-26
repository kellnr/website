<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import ChangeLogListItem from "../components/changelog/ChangeLogListItem.vue";
import ChangeLogItem from "../components/changelog/ChangeLogItem.vue";

import changelogData from "../data/changelog.json";
import type { ChangeLogDocument, ChangeLogEntry } from "../types/changelog";

const changelog = changelogData as ChangeLogDocument;

function entryHtml(entry: ChangeLogEntry): string {
  const links = entry.links ?? [];
  if (links.length === 0) return entry.content;

  const suffix = links
    .map(
      (l) =>
        ` <a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>`
    )
    .join("");

  return `${entry.content}${suffix}`;
}
</script>

<template>
  <div>
    <PageHeader title="Changelog" :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Docs' }, { label: 'Changelog' }]" />

    <section class="page-content">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-9">
            <div class="p-4 shadow rounded border">
              <div class="mb-4 p-3 rounded bg-light border">
                <h6 class="mb-1">Changelog format</h6>
                <p class="text-muted mb-0">
                  This changelog follows the
                  <a
                    href="https://keepachangelog.com/en/1.1.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Keep a Changelog</a
                  >
                  standard.
                </p>
              </div>

              <ChangeLogItem
                v-for="release in changelog.releases"
                :key="release.version"
                :date="release.date"
                :version="release.version"
                :is-latest="!!release.isLatest"
              >
                <ChangeLogListItem
                  v-for="(entry, idx) in release.entries"
                  :key="`${release.version}-${idx}`"
                  :type="entry.type"
                >
                  <span v-if="entry.scope" class="scope">{{ entry.scope }}</span>
                  <span v-html="entryHtml(entry)"></span>
                </ChangeLogListItem>
              </ChangeLogItem>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Changelog End -->
    <!--end section-->
  </div>
</template>

<style scoped>
.scope {
  display: inline-block;
  margin-right: 0.375rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  vertical-align: middle;
}
</style>
