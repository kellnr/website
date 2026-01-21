<script setup lang="ts">

</script>

<template>
    <div class="warn-block">
        <div class="warn-icon">
            <i class="mdi mdi-alert"></i>
        </div>
        <div class="warn-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.warn-block {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem 1.25rem;
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    border-radius: 0 8px 8px 0;
}

.warn-icon {
    flex-shrink: 0;
    color: #f59e0b;
    font-size: 1.25rem;
    line-height: 1.75;
}

.warn-content {
    color: #92400e;
    font-size: 1rem;
    line-height: 1.75;
}

.warn-content :deep(a) {
    color: #b45309;
    text-decoration: underline;
}
</style>
