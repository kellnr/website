<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        required: true,
    }
})
</script>

<template>
    <li class="text-muted my-2 ml-3">
        <vue-feather type="arrow-right-circle" class="fea icon-sm mr-2 align-middle"></vue-feather>
        <span class="font-weight-bold align-middle">{{ props.type }}:</span> <span class="align-middle"><slot></slot></span>
    </li>
</template>

<style>

</style>
