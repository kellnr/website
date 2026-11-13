import { describe, expect, it } from "vitest";
import { indexSections, makeSnippet, searchSections, type DocSection } from "@/utils/docSearch";

const sections: DocSection[] = [
  { id: "install", level: 2, heading: "Installation", text: "Install Kellnr with Docker or Helm." },
  {
    id: "config-oauth2",
    level: 4,
    heading: "OAuth2 Settings",
    text: "Client id and secret of the identity provider.",
  },
  {
    id: "auth",
    level: 3,
    heading: "Authentication",
    text: "Kellnr supports tokens and OAuth2 login.",
  },
  {
    id: "oauth2",
    level: 3,
    heading: "OAuth2/OIDC",
    text: "Log in with an external identity provider.",
  },
];

describe("searchSections", () => {
  it("returns nothing for an empty query", () => {
    expect(searchSections(sections, "   ")).toEqual([]);
  });

  it("matches case-insensitively in heading and text", () => {
    const ids = searchSections(sections, "OAUTH").map((r) => r.id);
    expect(ids).toEqual(expect.arrayContaining(["config-oauth2", "auth", "oauth2"]));
    expect(ids).not.toContain("install");
  });

  it("requires all query words", () => {
    expect(searchSections(sections, "kellnr docker").map((r) => r.id)).toEqual(["install"]);
  });

  it("lists heading matches by heading level, then text matches in document order", () => {
    expect(searchSections(sections, "oauth").map((r) => r.id)).toEqual([
      "oauth2",
      "config-oauth2",
      "auth",
    ]);
  });

  it("limits the number of results", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      id: `s${i}`,
      level: 3,
      heading: `Section ${i}`,
      text: "same text",
    }));
    expect(searchSections(many, "same")).toHaveLength(8);
    expect(searchSections(many, "same", 3)).toHaveLength(3);
  });

  it("returns heading and snippet", () => {
    expect(searchSections(sections, "tokens")).toEqual([
      {
        id: "auth",
        heading: "Authentication",
        snippet: "Kellnr supports tokens and OAuth2 login.",
      },
    ]);
  });
});

describe("makeSnippet", () => {
  const long = `${"alpha ".repeat(30)}needle ${"omega ".repeat(30)}`.trim();

  it("returns short text unchanged", () => {
    expect(makeSnippet("short text", ["text"])).toBe("short text");
  });

  it("cuts around the first match with ellipses at word boundaries", () => {
    const snippet = makeSnippet(long, ["needle"], 20);
    expect(snippet).toMatch(/^\.\.\.alpha .*needle.* omega\.\.\.$/);
    expect(snippet.length).toBeLessThanOrEqual(20 * 2 + "needle".length + 6);
  });

  it("starts at the beginning when only the heading matched", () => {
    expect(makeSnippet(long, ["missing"], 20)).toMatch(/^alpha alpha .*\.\.\.$/);
  });
});

describe("indexSections", () => {
  it("collects each heading with id and the text up to the next heading", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <h2 id="a">First <a data-search-ignore>#</a></h2>
      <p>Alpha   text.</p>
      <pre data-search-ignore>hidden duplicate</pre>
      <h3>No id</h3>
      <p>More alpha.</p>
      <h4 id="b">Second</h4>
      <p>Beta text.</p>`;
    expect(indexSections(root)).toEqual([
      { id: "a", level: 2, heading: "First", text: "Alpha text. No id More alpha." },
      { id: "b", level: 4, heading: "Second", text: "Beta text." },
    ]);
  });
});
