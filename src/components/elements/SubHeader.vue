<script setup lang="ts">
import HeadingAnchor from "./HeadingAnchor.vue";

const props = defineProps({
    id: {
        type: String,
        required: true
    },
})
</script>

<template>
    <h3 class="sub-header" v-bind:id="props.id"><HeadingAnchor :target-id="props.id"><slot></slot></HeadingAnchor></h3>
</template>

<style scoped>
.sub-header {
    display: block;
    clear: both;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    line-height: 1.3;
    scroll-margin-top: 80px;
}
</style>
