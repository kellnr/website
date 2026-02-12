<script setup lang="ts">

</script>

<template>
    <div class="attention-block">
        <div class="attention-icon">
            <i class="mdi mdi-information"></i>
        </div>
        <div class="attention-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.attention-block {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem 1.25rem;
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    border-radius: 0 8px 8px 0;
}

.attention-icon {
    flex-shrink: 0;
    color: #3b82f6;
    font-size: 1.25rem;
    line-height: 1.75;
}

.attention-content {
    color: #1e3a5f;
    font-size: 1rem;
    line-height: 1.75;
}

.attention-content :deep(a) {
    color: #2563eb;
    text-decoration: underline;
}
</style>
