<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";

const links = [
  { to: "/documentation", label: "Documentation" },
  { to: "/changelog", label: "Changelog" },
  { to: "/blog", label: "Blog" },
  { to: "/", label: "Home" },
];

let robots: HTMLMetaElement | undefined;

onMounted(() => {
  robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex";
  document.head.appendChild(robots);
});

onUnmounted(() => robots?.remove());
</script>

<template>
  <PageHeader
    title="Page not found"
    :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Not found' }]"
  />
  <section class="page-content">
    <div class="container">
      <p>This page does not exist. It may have moved or been removed.</p>
      <ul class="not-found-links">
        <li v-for="link in links" :key="link.to">
          <router-link :to="link.to">{{ link.label }}</router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.not-found-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 600;
}
</style>
