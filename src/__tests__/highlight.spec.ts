import { describe, expect, it } from "vitest";
import hljs from "@/highlight";

// highlight.js only bundles the languages registered in src/highlight.ts.
// These `lang` values are intentionally left to auto-detection.
const AUTO_DETECTED = new Set(["asm"]);

const sources = import.meta.glob<string>("/src/**/*.vue", {
  query: "?raw",
  import: "default",
  eager: true,
});

function usedLanguages(): Map<string, string> {
  const langs = new Map<string, string>();
  for (const [file, source] of Object.entries(sources)) {
    for (const match of source.matchAll(/<CodeBlock\s[^>]*\blang="([^"]+)"/g)) {
      langs.set(match[1]!, file);
    }
  }
  return langs;
}

describe("syntax highlighting", () => {
  it("finds code blocks to check", () => {
    expect(usedLanguages().size).toBeGreaterThan(0);
  });

  it.each([...usedLanguages()])("registers the language %s (used in %s)", (lang) => {
    if (AUTO_DETECTED.has(lang)) return;
    expect(hljs.getLanguage(lang), `register "${lang}" in src/highlight.ts`).toBeDefined();
  });
});
