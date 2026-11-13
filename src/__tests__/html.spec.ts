import { describe, expect, it } from "vitest";
import { escapeHtml } from "@/utils/html";

describe("escapeHtml", () => {
  it("escapes the characters that end text or attribute values", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
  });

  it("escapes an ampersand only once", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("keeps plain text unchanged", () => {
    expect(escapeHtml("Kellnr 7.2.0")).toBe("Kellnr 7.2.0");
  });
});
