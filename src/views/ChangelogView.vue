<script setup lang="ts">
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
    <!-- Hero Start -->
    <section class="bg-half bg-light d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title">Changelog</h4>
              <div class="page-next">
                <nav aria-label="breadcrumb" class="d-inline-block">
                  <ul class="breadcrumb bg-white rounded shadow mb-0">
                    <li class="breadcrumb-item">
                      <router-link to="/">Kellnr</router-link>
                    </li>
                    <li class="breadcrumb-item"><a href="#">Docs</a></li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Changelog
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
      <!--end container-->
    </section>
    <!--end section-->
    <!-- Hero End -->

    <!-- Shape Start -->
    <div class="position-relative">
      <div class="shape overflow-hidden text-white">
        <svg
          viewBox="0 0 2880 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
    <!--Shape End-->

    <!-- Changelog Start -->
    <section class="section">
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
