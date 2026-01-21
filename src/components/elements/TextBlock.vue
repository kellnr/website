<script setup lang="ts">

</script>

<template>
    <div class="text-block">
        <slot></slot>
    </div>
</template>

<style scoped>
.text-block {
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: #374151;
    font-size: 1rem;
    line-height: 1.75;
}

.text-block :deep(a) {
    color: #2f55d4;
    text-decoration: none;
}

.text-block :deep(a:hover) {
    text-decoration: underline;
}
</style>
