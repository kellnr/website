<script setup lang="ts">
const props = defineProps({
    id: {
        type: String,
        required: true
    },
})
</script>

<template>
    <h3 class="sub-header" v-bind:id="props.id"><slot></slot></h3>
</template>

<style scoped>
.sub-header {
    display: block;
    clear: both;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.3;
}
</style>
