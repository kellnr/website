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
      <i class="mdi" :class="icons[props.variant]" aria-hidden="true"></i>
    </div>
    <div class="callout-content prose-links">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.warn {
  --callout-bg: var(--color-warning-soft);
  --callout-accent: var(--color-warning-border);
  --callout-icon: var(--color-warning);
}

.tip {
  --callout-bg: var(--color-accent-soft);
  --callout-accent: var(--color-accent);
  --callout-icon: var(--color-accent);
}

.attention {
  --callout-bg: var(--color-info-soft);
  --callout-accent: var(--color-info);
  --callout-icon: var(--color-info);
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
  color: var(--callout-icon);
  font-size: 1.25rem;
  line-height: 1.75;
}

.callout-content {
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.75;
}
</style>
