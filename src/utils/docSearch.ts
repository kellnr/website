export interface DocSection {
  id: string;
  /** Heading level, 2 for h2. */
  level: number;
  heading: string;
  text: string;
}

export interface SearchResult {
  id: string;
  heading: string;
  snippet: string;
}

const SECTION_HEADINGS = new Set(["H2", "H3", "H4"]);
const MAX_RESULTS = 8;
const SNIPPET_RADIUS = 60;

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function isIgnored(node: Node, root: HTMLElement): boolean {
  for (let el = node.parentElement; el && el !== root; el = el.parentElement) {
    if (el.hasAttribute("data-search-ignore")) return true;
  }
  return false;
}

function sectionHeading(node: Node, root: HTMLElement): HTMLElement | null {
  for (let el = node.parentElement; el && el !== root; el = el.parentElement) {
    if (SECTION_HEADINGS.has(el.tagName) && el.id) return el;
  }
  return null;
}

/** Splits the content into sections: each h2/h3/h4 with id and the text up to the next one. */
export function indexSections(root: HTMLElement): DocSection[] {
  const sections: { id: string; level: number; heading: string[]; text: string[] }[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (isIgnored(node, root)) continue;
    const heading = sectionHeading(node, root);
    if (heading && sections.at(-1)?.id !== heading.id) {
      sections.push({ id: heading.id, level: Number(heading.tagName[1]), heading: [], text: [] });
    }
    const current = sections.at(-1);
    if (!current) continue;
    (heading ? current.heading : current.text).push(node.textContent ?? "");
  }
  return sections.map(({ id, level, heading, text }) => ({
    id,
    level,
    heading: normalize(heading.join(" ")),
    text: normalize(text.join(" ")),
  }));
}

function cutAtWordStart(text: string, from: number): number {
  if (from <= 0) return 0;
  const space = text.indexOf(" ", from);
  return space === -1 ? from : space + 1;
}

function cutAtWordEnd(text: string, to: number): number {
  if (to >= text.length) return text.length;
  const space = text.lastIndexOf(" ", to);
  return space === -1 ? to : space;
}

/** A part of `text` around the first occurrence of one of the lowercase `words`. */
export function makeSnippet(
  text: string,
  words: readonly string[],
  radius = SNIPPET_RADIUS
): string {
  const lower = text.toLowerCase();
  const positions = words.map((word) => lower.indexOf(word)).filter((pos) => pos !== -1);
  const match = positions.length ? Math.min(...positions) : 0;
  const matchLength = positions.length ? (words[positions.indexOf(match)]?.length ?? 0) : 0;

  const start = cutAtWordStart(text, match - radius);
  const end = cutAtWordEnd(text, match + matchLength + radius);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";
  return `${prefix}${text.slice(start, end)}${suffix}`;
}

/** Sections containing all query words: heading matches by level, then text matches in document order. */
export function searchSections(
  sections: readonly DocSection[],
  query: string,
  limit = MAX_RESULTS
): SearchResult[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const matches = sections.filter((section) => {
    const haystack = `${section.heading} ${section.text}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
  const inHeading = (section: DocSection) =>
    words.some((word) => section.heading.toLowerCase().includes(word));
  const headingMatches = matches.filter(inHeading).sort((a, b) => a.level - b.level);
  const ranked = [...headingMatches, ...matches.filter((s) => !inHeading(s))];

  return ranked.slice(0, limit).map((section) => ({
    id: section.id,
    heading: section.heading,
    snippet: makeSnippet(section.text, words),
  }));
}
