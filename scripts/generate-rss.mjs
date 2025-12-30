/**
 * Build-time RSS/Atom feed generator for Kellnr releases + blog posts.
 *
 * Sources of truth:
 * - `src/data/changelog.json` (release entries)
 * - `src/data/blog-posts.json` (blog entries)
 *
 * Generates: `public/rss.xml`
 *
 * Usage:
 *   node scripts/generate-rss.mjs
 *
 * Notes:
 * - This generates an Atom feed (matches existing `public/rss.xml` structure).
 * - Dates in changelog.json are in a human format (e.g. "29. December 2025").
 *   This script parses them into RFC3339 timestamps.
 * - Dates in blog-posts.json are already RFC3339 timestamps.
 *
 * This script includes lightweight runtime validation of both JSON inputs to
 * fail fast with helpful error messages during CI/builds.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const CHANGELOG_JSON_PATH = path.join(
  PROJECT_ROOT,
  "src",
  "data",
  "changelog.json"
);
const BLOG_POSTS_JSON_PATH = path.join(
  PROJECT_ROOT,
  "src",
  "data",
  "blog-posts.json"
);
const OUTPUT_RSS_PATH = path.join(PROJECT_ROOT, "public", "rss.xml");

const SITE_URL = "https://kellnr.io";
const FEED_ID = "kellnr.io/blog";
const FEED_TITLE = "kellnr.io - The Rust Registry";
const FEED_SUBTITLE = "Rust development related blog";
const FEED_SELF = `${SITE_URL}/rss.xml`;
const FEED_ALTERNATE = `${SITE_URL}/blog`;
const FEED_ICON = `${SITE_URL}/favicon.ico`;
const FEED_LOGO = `${SITE_URL}/favicon.ico`;
const CHANGELOG_ENTRY_LINK = `${SITE_URL}/changelog`;

const MONTHS = new Map([
  ["January", 1],
  ["February", 2],
  ["March", 3],
  ["April", 4],
  ["May", 5],
  ["June", 6],
  ["July", 7],
  ["August", 8],
  ["September", 9],
  ["October", 10],
  ["November", 11],
  ["December", 12],
]);

function escapeXml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Wrap text into a CDATA block so Atom <content type="html"> can carry real HTML
 * without escaping. Also makes sure that "]]>" can't break the CDATA section.
 */
function cdata(text) {
  const s = String(text ?? "");
  // Split occurrences of "]]>" so the CDATA section can't be terminated early
  return `<![CDATA[${s.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertString(value, path) {
  assert(
    typeof value === "string",
    `Expected string at ${path}, got ${typeof value}`
  );
}

function assertOptionalArray(value, path) {
  if (value === undefined) return;
  assert(
    Array.isArray(value),
    `Expected array at ${path}, got ${typeof value}`
  );
}

function assertOptionalBoolean(value, path) {
  if (value === undefined) return;
  assert(
    typeof value === "boolean",
    `Expected boolean at ${path}, got ${typeof value}`
  );
}

function validateChangelogDocument(doc, filePath) {
  assert(
    isPlainObject(doc),
    `Invalid changelog JSON: expected object at ${filePath}`
  );
  assert(
    Array.isArray(doc.releases),
    `Invalid changelog JSON: expected "releases" array at ${filePath}`
  );

  doc.releases.forEach((r, i) => {
    const base = `changelog.releases[${i}]`;
    assert(isPlainObject(r), `Expected object at ${base}`);

    assertString(r.version, `${base}.version`);
    assertString(r.date, `${base}.date`);
    assertOptionalBoolean(r.isLatest, `${base}.isLatest`);

    assert(Array.isArray(r.entries), `Expected array at ${base}.entries`);
    r.entries.forEach((e, j) => {
      const ep = `${base}.entries[${j}]`;
      assert(isPlainObject(e), `Expected object at ${ep}`);

      assertString(e.type, `${ep}.type`);
      assertString(e.content, `${ep}.content`);
      assertOptionalArray(e.links, `${ep}.links`);

      if (Array.isArray(e.links)) {
        e.links.forEach((l, k) => {
          const lp = `${ep}.links[${k}]`;
          assert(isPlainObject(l), `Expected object at ${lp}`);
          assertString(l.label, `${lp}.label`);
          assertString(l.url, `${lp}.url`);
        });
      }
    });
  });
}

function validateBlogPostsDocument(doc, filePath) {
  assert(
    isPlainObject(doc),
    `Invalid blog-posts JSON: expected object at ${filePath}`
  );
  assert(
    Array.isArray(doc.posts),
    `Invalid blog-posts JSON: expected "posts" array at ${filePath}`
  );

  doc.posts.forEach((p, i) => {
    const base = `blog.posts[${i}]`;
    assert(isPlainObject(p), `Expected object at ${base}`);

    assertString(p.id, `${base}.id`);
    assertString(p.title, `${base}.title`);
    assertString(p.url, `${base}.url`);
    assertString(p.published, `${base}.published`);
    assertString(p.summaryHtml, `${base}.summaryHtml`);

    const parsed = Date.parse(p.published);
    assert(
      Number.isFinite(parsed),
      `Invalid RFC3339 datetime at ${base}.published: "${p.published}"`
    );
  });
}

/**
 * Changelog date format: "29. December 2025" OR "11.November 2021"
 * Returns an RFC3339 string in UTC.
 */
function parseChangelogDateToRfc3339(dateStr) {
  const raw = String(dateStr).trim();

  // Allow "11.November 2021" or "29. December 2025"
  // Split day from rest by "." (first dot after day)
  const dotIdx = raw.indexOf(".");
  if (dotIdx === -1) {
    throw new Error(`Unsupported date format (missing dot): "${raw}"`);
  }

  const dayRaw = raw.slice(0, dotIdx).trim();
  const rest = raw.slice(dotIdx + 1).trim();

  const day = Number.parseInt(dayRaw, 10);
  if (!Number.isFinite(day) || day < 1 || day > 31) {
    throw new Error(`Invalid day in date: "${raw}"`);
  }

  // rest should be like "December 2025" (month + year)
  const parts = rest.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`Unsupported date format (month/year missing): "${raw}"`);
  }

  const monthName = parts[0];
  const yearRaw = parts[1];
  const month = MONTHS.get(monthName);
  if (!month) {
    throw new Error(`Unknown month "${monthName}" in date: "${raw}"`);
  }

  const year = Number.parseInt(yearRaw, 10);
  if (!Number.isFinite(year) || year < 1970 || year > 9999) {
    throw new Error(`Invalid year in date: "${raw}"`);
  }

  // Use noon UTC to avoid edge cases if consumers convert time zones.
  const dt = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return dt.toISOString();
}

function compareEntriesDesc(a, b) {
  const da = Date.parse(a.publishedRfc3339);
  const db = Date.parse(b.publishedRfc3339);
  if (Number.isFinite(da) && Number.isFinite(db) && da !== db) return db - da;
  return String(b.id).localeCompare(String(a.id));
}

function buildReleaseEntryContentHtml(release) {
  // Render a concise HTML body:
  // "Version X of Kellnr, the private Rust registry, is released."
  // Followed by bullet list from changelog entries.

  const lines = [];
  lines.push(
    `Version ${escapeXml(
      release.version
    )} of Kellnr, the private Rust registry, is released.`
  );

  if (Array.isArray(release.entries) && release.entries.length > 0) {
    // Group by type to produce a Keep-a-Changelog-ish summary.
    const order = [
      "Added",
      "Changed",
      "Deprecated",
      "Fixed",
      "Removed",
      "Security",
    ];
    const byType = new Map();
    for (const e of release.entries) {
      const t = String(e.type || "Changed");
      if (!byType.has(t)) byType.set(t, []);
      byType.get(t).push(e);
    }

    const types = order
      .filter((t) => byType.has(t))
      .concat([...byType.keys()].filter((t) => !order.includes(t)));

    for (const type of types) {
      const items = byType.get(type);
      if (!items || items.length === 0) continue;

      lines.push(`<br/>`);
      lines.push(`<strong>${escapeXml(type)}:</strong>`);
      lines.push(`<ul>`);
      for (const entry of items) {
        // `content` in changelog.json may contain HTML (e.g. <i>).
        // We keep it as-is, but we still need to safely render appended links.
        const contentHtml = String(entry.content ?? "");

        const links = Array.isArray(entry.links) ? entry.links : [];
        const linksHtml = links
          .map((l) => {
            const href = escapeXml(l.url ?? "");
            const label = escapeXml(l.label ?? l.url ?? "");
            return ` <a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
          })
          .join("");

        lines.push(`<li>${contentHtml}${linksHtml}</li>`);
      }
      lines.push(`</ul>`);
    }
  }

  return lines.join("\n");
}

function buildAtomEntryXml(entry) {
  return [
    `  <entry>`,
    `    <id>${escapeXml(entry.id)}</id>`,
    `    <title>${escapeXml(entry.title)}</title>`,
    `    <link href="${escapeXml(entry.link)}" />`,
    `    <published>${escapeXml(entry.publishedRfc3339)}</published>`,
    `    <updated>${escapeXml(entry.updatedRfc3339)}</updated>`,
    `    <content type="html">${cdata(entry.contentHtml)}</content>`,
    `  </entry>`,
  ].join("\n");
}

async function tryReadJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    // If the optional blog posts file isn't present yet, keep the feed working.
    if (String(err?.code) === "ENOENT") return null;
    throw err;
  }
}

async function main() {
  const changelogDoc = await tryReadJson(CHANGELOG_JSON_PATH);
  validateChangelogDocument(changelogDoc, CHANGELOG_JSON_PATH);

  const releases = changelogDoc.releases.map((r) => {
    const publishedRfc3339 = parseChangelogDateToRfc3339(r.date);
    const version = String(r.version);

    return {
      kind: "release",
      version,
      id: `${CHANGELOG_ENTRY_LINK}#${version}`,
      title: `Kellnr ${version} release`,
      link: CHANGELOG_ENTRY_LINK,
      publishedRfc3339,
      updatedRfc3339: publishedRfc3339,
      contentHtml: buildReleaseEntryContentHtml({
        version,
        entries: r.entries,
      }),
    };
  });

  const blogDoc = await tryReadJson(BLOG_POSTS_JSON_PATH);

  // blog-posts.json is optional; validate only when present
  if (blogDoc !== null) {
    validateBlogPostsDocument(blogDoc, BLOG_POSTS_JSON_PATH);
  }
  const blogPosts = Array.isArray(blogDoc?.posts) ? blogDoc.posts : [];

  const blogEntries = blogPosts.map((p) => {
    const publishedRfc3339 = p.published;

    // Atom wants globally unique IDs; prefer canonical URL.
    const id = p.url;

    return {
      kind: "blog",
      id,
      title: p.title,
      link: p.url,
      publishedRfc3339,
      updatedRfc3339: publishedRfc3339,
      contentHtml: p.summaryHtml,
    };
  });

  const allEntries = [...releases, ...blogEntries].sort(compareEntriesDesc);

  const updated =
    allEntries.length > 0
      ? allEntries[0].publishedRfc3339
      : new Date().toISOString();

  const entriesXml = allEntries.map(buildAtomEntryXml).join("\n");

  const feedXml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">`,
    `  <id>${escapeXml(FEED_ID)}</id>`,
    `  <title>${escapeXml(FEED_TITLE)}</title>`,
    `  <subtitle>${escapeXml(FEED_SUBTITLE)}</subtitle>`,
    `  <updated>${escapeXml(updated)}</updated>`,
    `  <link rel="self" href="${escapeXml(
      FEED_SELF
    )}" type="application/atom+xml" />`,
    `  <link rel="alternate" href="${escapeXml(
      FEED_ALTERNATE
    )}" type="text/html" />`,
    `  <icon>${escapeXml(FEED_ICON)}</icon>`,
    `  <logo>${escapeXml(FEED_LOGO)}</logo>`,
    entriesXml,
    `</feed>`,
    ``,
  ].join("\n");

  await fs.writeFile(OUTPUT_RSS_PATH, feedXml, "utf8");
  // eslint-disable-next-line no-console
  console.log(
    `Generated ${path.relative(
      PROJECT_ROOT,
      OUTPUT_RSS_PATH
    )} from changelog.json + blog-posts.json`
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
