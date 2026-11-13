<script lang="ts">
export interface ScrollState {
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
}

/** True while part of the content is hidden beyond the right edge; tolerates subpixel rounding. */
export function hasHiddenOverflow({ scrollLeft, clientWidth, scrollWidth }: ScrollState): boolean {
  return scrollLeft + clientWidth < scrollWidth - 1;
}

/** True when the content is wider than its area; only then the area needs to be focusable. */
export function isScrollable({ clientWidth, scrollWidth }: ScrollState): boolean {
  return clientWidth < scrollWidth - 1;
}
</script>

<script setup lang="ts">
import { Comment, ref, onBeforeUnmount, onMounted, useSlots, type VNode } from "vue";
import hljs from "@/highlight";

defineProps<{
  lang: string;
}>();

const codeContainer = ref<HTMLElement | null>(null);
const scrollArea = ref<HTMLElement | null>(null);
const overflowsRight = ref(false);
const scrollable = ref(false);
let resizeObserver: ResizeObserver | null = null;
const copied = ref(false);

/** Text of the slot content, so the code renders in the first pass without a layout shift. */
function slotText(vnodes: VNode[]): string {
  return vnodes
    .map((vnode) => {
      if (vnode.type === Comment) return "";
      if (typeof vnode.children === "string") return vnode.children;
      if (Array.isArray(vnode.children)) return slotText(vnode.children as VNode[]);
      return "";
    })
    .join("");
}

function stripIndent(text: string): string {
  const lines = text.split("\n");
  const hasContent = (line: string) => line.trim() !== "";

  // Drop blank lines around the code (from template formatting)
  const start = lines.findIndex(hasContent);
  if (start === -1) return "";
  const end = lines.length - [...lines].reverse().findIndex(hasContent);
  const content = lines.slice(start, end);

  const minIndent = Math.min(
    ...content.filter(hasContent).map((line) => line.length - line.trimStart().length)
  );
  return content.map((line) => line.slice(minIndent)).join("\n");
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

function updateOverflow() {
  if (scrollArea.value) {
    overflowsRight.value = hasHiddenOverflow(scrollArea.value);
    scrollable.value = isScrollable(scrollArea.value);
  }
}

function watchOverflow() {
  const area = scrollArea.value;
  if (!area) return;
  area.addEventListener("scroll", updateOverflow, { passive: true });
  resizeObserver = new ResizeObserver(updateOverflow);
  resizeObserver.observe(area);
}

onBeforeUnmount(() => {
  scrollArea.value?.removeEventListener("scroll", updateOverflow);
  resizeObserver?.disconnect();
});

const processedCode = stripIndent(slotText(useSlots().default?.() ?? []));

onMounted(() => {
  watchOverflow();
  const codeEl = codeContainer.value?.querySelector<HTMLElement>("code.highlight-target");
  if (codeEl) {
    hljs.highlightElement(codeEl);
  }
  updateOverflow();
});
</script>

<template>
  <div ref="codeContainer" class="code-block">
    <div class="code-header" data-search-ignore>
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
    <div class="code-scroll" :class="{ 'overflows-right': overflowsRight }">
      <div
        ref="scrollArea"
        class="code-content"
        :tabindex="scrollable ? 0 : undefined"
        :role="scrollable ? 'region' : undefined"
        :aria-label="scrollable ? `${lang} code` : undefined"
      >
        <pre v-if="processedCode" class="code-pre"><code class="highlight-target" :class="lang">{{ processedCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-code-bg);
  border: 1px solid var(--color-border);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--color-code-header);
  border-bottom: 1px solid var(--color-border);
}

.code-lang {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
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
  color: var(--color-text-muted);
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: var(--color-border);
  color: var(--color-accent);
}

.copy-text {
  font-family: inherit;
}

.code-scroll {
  position: relative;
}

/* Hints at code hidden beyond the right edge until scrolled to the end. */
.code-scroll::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 2.5rem;
  pointer-events: none;
  background: linear-gradient(to right, transparent, var(--color-code-bg));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.code-scroll.overflows-right::after {
  opacity: 1;
}

.code-content {
  padding: 1rem;
  overflow-x: auto;
}

.code-content:focus-visible,
.copy-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

/* Bootstrap lets pre scroll itself; .code-content scrolls instead, so it can track the overflow. */
.code-pre,
.code-pre code {
  overflow: visible;
}

.code-pre {
  margin: 0;
  padding: 0;
  background: transparent;
}

.code-block :deep(code) {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-code-text);
  background: transparent;
}
</style>
