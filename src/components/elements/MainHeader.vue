<script setup lang="ts">
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
    <h1 class="mt-4 main-header" v-bind:id="props.id">
        <i v-if="props.icon" :class="`mdi mdi-${props.icon} header-icon`"></i>
        <slot></slot>
    </h1>
</template>

<style scoped>
.main-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-icon {
    color: #2f55d4;
    font-size: 1.75rem;
}
</style>
