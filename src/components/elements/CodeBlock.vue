<script setup lang="ts">
import { ref, onMounted, useSlots } from "vue";
import hljs from "highlight.js";

const props = defineProps<{
  lang?: string;
}>();

const slots = useSlots();
const codeContainer = ref<HTMLElement | null>(null);
const processedCode = ref("");
const isNewFormat = ref(false);

function stripIndent(text: string): string {
  const lines = text.split("\n");

  // Remove empty first and last lines (from template formatting)
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  if (lines.length === 0) return "";

  // Find minimum indentation (excluding empty lines)
  const minIndent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => {
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      return Math.min(min, indent);
    }, Infinity);

  // Strip the common indentation from all lines
  if (minIndent > 0 && minIndent !== Infinity) {
    return lines.map((line) => line.slice(minIndent)).join("\n");
  }

  return lines.join("\n");
}

onMounted(() => {
  if (!codeContainer.value) return;

  // Check if using new format (lang prop) or legacy format (pre/code in slot)
  if (props.lang) {
    // New format: get text from hidden raw content, strip indent, highlight
    const rawContent = codeContainer.value.querySelector(".raw-content");
    if (rawContent) {
      processedCode.value = stripIndent(rawContent.textContent || "");
      isNewFormat.value = true;

      // Apply highlighting after Vue updates the DOM
      setTimeout(() => {
        const codeEl = codeContainer.value?.querySelector("code.highlight-target");
        if (codeEl) {
          hljs.highlightElement(codeEl as HTMLElement);
        }
      }, 0);
    }
  } else {
    // Legacy format: strip indentation from existing code elements and re-highlight
    const codeElements = codeContainer.value.querySelectorAll("code");
    codeElements.forEach((codeElement) => {
      codeElement.textContent = stripIndent(codeElement.textContent || "");
      hljs.highlightElement(codeElement as HTMLElement);
    });
  }
});
</script>

<template>
  <div ref="codeContainer" class="mt-4 p-3 bg-light rounded shadow w-100">
    <!-- New format: lang prop provided -->
    <template v-if="lang">
      <pre class="raw-content" style="display: none;"><slot></slot></pre>
      <pre v-if="processedCode"><code class="highlight-target" :class="lang">{{ processedCode }}</code></pre>
    </template>
    <!-- Legacy format: slot contains pre/code -->
    <slot v-else></slot>
  </div>
</template>

<style scoped></style>
