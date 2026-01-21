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
  <div ref="codeContainer" class="code-block">
    <div class="code-header" v-if="lang">
      <span class="code-lang">{{ lang }}</span>
      <button class="copy-btn" @click="copyCode" :title="copied ? 'Copied!' : 'Copy to clipboard'">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="copy-text">{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>
    <div class="code-content">
      <!-- New format: lang prop provided -->
      <template v-if="lang">
        <pre class="raw-content" style="display: none;"><slot></slot></pre>
        <pre v-if="processedCode" class="code-pre"><code class="highlight-target" :class="lang">{{ processedCode }}</code></pre>
      </template>
      <!-- Legacy format: slot contains pre/code -->
      <slot v-else></slot>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.code-lang {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #e2e8f0;
  color: #2f55d4;
}

.copy-text {
  font-family: inherit;
}

.code-content {
  padding: 1rem;
  overflow-x: auto;
}

.code-pre {
  margin: 0;
  padding: 0;
  background: transparent;
}

.code-block :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent;
}

.code-block :deep(code) {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #334155;
  background: transparent;
}

/* Syntax highlighting for light theme */
.code-block :deep(.hljs) {
  background: transparent;
  color: #334155;
}

.code-block :deep(.hljs-keyword),
.code-block :deep(.hljs-selector-tag),
.code-block :deep(.hljs-built_in) {
  color: #8b5cf6;
}

.code-block :deep(.hljs-string),
.code-block :deep(.hljs-attr) {
  color: #059669;
}

.code-block :deep(.hljs-comment) {
  color: #94a3b8;
  font-style: italic;
}

.code-block :deep(.hljs-number),
.code-block :deep(.hljs-literal) {
  color: #dc2626;
}

.code-block :deep(.hljs-variable),
.code-block :deep(.hljs-template-variable) {
  color: #0284c7;
}

.code-block :deep(.hljs-title),
.code-block :deep(.hljs-section) {
  color: #d97706;
}

.code-block :deep(.hljs-type),
.code-block :deep(.hljs-class) {
  color: #ca8a04;
}

.code-block :deep(.hljs-function) {
  color: #2563eb;
}

.code-block :deep(.hljs-attribute) {
  color: #059669;
}

.code-block :deep(.hljs-symbol),
.code-block :deep(.hljs-bullet) {
  color: #7c3aed;
}

.code-block :deep(.hljs-meta) {
  color: #64748b;
}
</style>
