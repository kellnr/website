<script setup lang="ts">
const props = defineProps<{
  variant: "warn" | "tip" | "attention";
}>();

const icons = {
  warn: "mdi-alert",
  tip: "mdi-lightbulb-on-outline",
  attention: "mdi-information",
};
</script>

<template>
  <div class="callout-block" :class="props.variant">
    <div class="callout-icon">
      <i class="mdi" :class="icons[props.variant]"></i>
    </div>
    <div class="callout-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.warn {
  --callout-bg: #fffbeb;
  --callout-accent: #f59e0b;
  --callout-text: #92400e;
  --callout-link: #b45309;
}

.tip {
  --callout-bg: #eff6ff;
  --callout-accent: #2f55d4;
  --callout-text: #1e3a8a;
  --callout-link: #1d4ed8;
}

.attention {
  --callout-bg: #eff6ff;
  --callout-accent: #3b82f6;
  --callout-text: #1e3a5f;
  --callout-link: #2563eb;
}

.callout-block {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--callout-bg);
  border-left: 4px solid var(--callout-accent);
  border-radius: 0 8px 8px 0;
}

.callout-icon {
  flex-shrink: 0;
  color: var(--callout-accent);
  font-size: 1.25rem;
  line-height: 1.75;
}

.callout-content {
  color: var(--callout-text);
  font-size: 1rem;
  line-height: 1.75;
}

.callout-content :deep(a) {
  color: var(--callout-link);
  text-decoration: underline;
}
</style>
