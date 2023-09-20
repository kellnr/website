<script setup lang="ts">
import {RouterView} from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/FooterBar.vue";
import {onMounted} from "vue";
import router from "@/router";

onMounted(() => {
    // From testing, without a brief timeout, it won't work.
    setTimeout(() => scrollFix(router.hash), 1);
});

function scrollFix(hashbang)
{
    location.hash = hashbang;
}
</script>

<template>
    <NavBar :is-white-navbar=true :nav-light=true :is-icons=true />
    <RouterView/>
    <Footer />
</template>

<style>
</style>
