<script setup lang="ts">
import HeadingAnchor from "./HeadingAnchor.vue";

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    },
})
</script>

<template>
    <h2 class="mt-4 main-header" v-bind:id="props.id">
        <i v-if="props.icon" :class="`mdi mdi-${props.icon} header-icon`" aria-hidden="true"></i>
        <HeadingAnchor :target-id="props.id"><slot></slot></HeadingAnchor>
    </h2>
</template>

<style scoped>
/* Rendered as h2 below the page h1, but keeps the size of the former h1. */
.main-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 2.5rem;
    scroll-margin-top: 80px;
}

.header-icon {
    color: var(--color-accent);
    font-size: 1.75rem;
}
</style>
