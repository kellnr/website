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
    <h4 class="minor-header" v-bind:id="props.id">
        <i v-if="props.icon" :class="`mdi mdi-${props.icon} minor-header-icon`" aria-hidden="true"></i>
        <HeadingAnchor :target-id="props.id"><slot></slot></HeadingAnchor>
    </h4>
</template>

<style scoped>
.minor-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    clear: both;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-text);
    line-height: 1.3;
    scroll-margin-top: 80px;
}

.minor-header-icon {
    color: var(--color-accent);
    font-size: 1.25rem;
}
</style>
