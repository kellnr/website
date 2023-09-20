<script setup lang="ts">
const props = defineProps({
    version: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    isLatest: {
        type: Boolean,
        required: false,
        default: false,
    },
})
</script>

<template>
    <h5>Version <span class="text-success">{{ props.version }}</span> - {{  props.date }} <span v-if="props.isLatest" class="badge text-white badge-pill bg-danger ml-2">Latest Updated</span></h5>
    <ul class="list-unstyled">
        <slot></slot>
    </ul>
</template>

<style>

</style>
