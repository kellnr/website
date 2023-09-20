<script setup lang="ts">
const props = defineProps({
    id: {
        type: String,
        required: true
    },
})
</script>

<template>
    <h1 class="mt-4" v-bind:id="props.id"><slot></slot></h1>
</template>

<style scoped>

</style>
