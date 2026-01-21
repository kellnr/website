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
const copied = ref(false);

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

async function copyCode() {
  if (!codeContainer.value) return;

  const codeEl = codeContainer.value.querySelector("code");
  if (codeEl) {
    try {
      await navigator.clipboard.writeText(codeEl.textContent || "");
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
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
  <div ref="codeContainer" class="code-block mt-4 p-3 bg-light rounded shadow w-100">
    <button class="copy-btn" @click="copyCode" :title="copied ? 'Copied!' : 'Copy to clipboard'">
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>
    <!-- New format: lang prop provided -->
    <template v-if="lang">
      <pre class="raw-content" style="display: none;"><slot></slot></pre>
      <pre v-if="processedCode"><code class="highlight-target" :class="lang">{{ processedCode }}</code></pre>
    </template>
    <!-- Legacy format: slot contains pre/code -->
    <slot v-else></slot>
  </div>
</template>

<style scoped>
.code-block {
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  background: #fff;
  color: #2f55d4;
  border-color: #2f55d4;
}

.copy-btn svg {
  display: block;
}
</style>
