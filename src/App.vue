<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/FooterBar.vue";

const main = ref<HTMLElement>();

function skipToContent() {
  main.value?.focus();
}
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="skipToContent">Skip to content</a>
  <NavBar />
  <main id="main" ref="main" tabindex="-1">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
main:focus {
  outline: none;
}
</style>
