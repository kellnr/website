<script setup lang="ts">
defineProps<{
  /** Id of the heading the link points to. */
  targetId: string;
}>();
</script>

<!-- The heading text itself is the link, so the heading's accessible name stays its visible text. -->
<template>
  <a class="heading-link" :href="`#${targetId}`"><slot></slot></a>
</template>

<style scoped>
.heading-link {
  color: inherit;
  text-decoration: none;
}

.heading-link:hover {
  color: inherit;
  text-decoration: none;
}

/* The "/ ''" alternative text keeps the indicator out of the accessible name; the first
   declaration is the fallback for browsers without it. */
.heading-link::after {
  content: "#";
  content: "#" / "";
  margin-left: 0.4rem;
  color: var(--color-text-subtle);
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.heading-link:hover::after,
.heading-link:focus-visible::after {
  opacity: 1;
  color: var(--color-accent);
}

.heading-link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .heading-link::after {
    transition: none;
  }
}
</style>
