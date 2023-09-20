<script setup lang="ts">
const props = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: false,
        default: ""
    }
})
</script>

<template>
    <div class="mt-4 p-2 rounded shadow w-100">
        <img class="image" v-bind:src="props.src" v-bind:alt="props.alt" />
    </div>
</template>

<style scoped>
.image {
    max-width: 100%;
}
</style>
