<script setup lang="ts">

</script>

<template>
    <div class="tip-block">
        <div class="tip-icon">
            <i class="mdi mdi-lightbulb-on-outline"></i>
        </div>
        <div class="tip-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.tip-block {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem 1.25rem;
    background: #eff6ff;
    border-left: 4px solid #2f55d4;
    border-radius: 0 8px 8px 0;
}

.tip-icon {
    flex-shrink: 0;
    color: #2f55d4;
    font-size: 1.25rem;
    line-height: 1.75;
}

.tip-content {
    color: #1e3a8a;
    font-size: 1rem;
    line-height: 1.75;
}

.tip-content :deep(a) {
    color: #1d4ed8;
    text-decoration: underline;
}
</style>
