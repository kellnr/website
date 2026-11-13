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
 * - Dates in changelog.json are ISO dates (e.g. "2025-12-29").
 *   This script validates them and converts them into RFC3339 timestamps.
 * - Dates in blog-posts.json are already RFC3339 timestamps.
 *
 * The inputs are validated by `feed-data.mjs` to fail fast with helpful error
 * messages during CI/builds.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  changelogDateToRfc3339,
  groupEntriesByType,
  validateBlogPostsDocument,
  validateChangelogDocument,
  versionId,
} from "./feed-data.mjs";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHANGELOG_JSON_PATH = path.join(PROJECT_ROOT, "src", "data", "changelog.json");
const BLOG_POSTS_JSON_PATH = path.join(PROJECT_ROOT, "src", "data", "blog-posts.json");
const BLOG_POST_VIEWS_DIR = path.join(PROJECT_ROOT, "src", "views", "posts");
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

function compareEntriesDesc(a, b) {
  const da = Date.parse(a.publishedRfc3339);
  const db = Date.parse(b.publishedRfc3339);
  if (Number.isFinite(da) && Number.isFinite(db) && da !== db) return db - da;
  return String(b.id).localeCompare(String(a.id));
}

function renderEntryItem(entry) {
  // `content` in changelog.json may contain HTML (e.g. <i>) and is kept as-is.
  const scopeHtml = entry.scope ? `<em>${escapeXml(entry.scope)}:</em> ` : "";
  const contentHtml = scopeHtml + String(entry.content ?? "");

  const links = Array.isArray(entry.links) ? entry.links : [];
  const linksHtml = links
    .map((l) => {
      const href = escapeXml(l.url ?? "");
      const label = escapeXml(l.label ?? l.url ?? "");
      return ` <a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    })
    .join("");

  return `<li>${contentHtml}${linksHtml}</li>`;
}

function buildReleaseEntryContentHtml(release) {
  const lines = [
    `Version ${escapeXml(release.version)} of Kellnr, the private Rust registry, is released.`,
  ];

  const entries = Array.isArray(release.entries) ? release.entries : [];
  for (const [type, items] of groupEntriesByType(entries)) {
    lines.push(`<br/>`, `<strong>${escapeXml(type)}:</strong>`, `<ul>`);
    lines.push(...items.map(renderEntryItem));
    lines.push(`</ul>`);
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

  const releases = changelogDoc.releases.map((r, i) => {
    const publishedRfc3339 = changelogDateToRfc3339(r.date, `changelog.releases[${i}].date`);
    const version = String(r.version);

    return {
      kind: "release",
      version,
      id: `${CHANGELOG_ENTRY_LINK}#${version}`,
      title: `Kellnr ${version} release`,
      link: `${CHANGELOG_ENTRY_LINK}#${versionId(version)}`,
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
    validateBlogPostsDocument(blogDoc, BLOG_POSTS_JSON_PATH, BLOG_POST_VIEWS_DIR);
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

  const updated = allEntries.length > 0 ? allEntries[0].publishedRfc3339 : new Date().toISOString();

  const entriesXml = allEntries.map(buildAtomEntryXml).join("\n");

  const feedXml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">`,
    `  <id>${escapeXml(FEED_ID)}</id>`,
    `  <title>${escapeXml(FEED_TITLE)}</title>`,
    `  <subtitle>${escapeXml(FEED_SUBTITLE)}</subtitle>`,
    `  <updated>${escapeXml(updated)}</updated>`,
    `  <link rel="self" href="${escapeXml(FEED_SELF)}" type="application/atom+xml" />`,
    `  <link rel="alternate" href="${escapeXml(FEED_ALTERNATE)}" type="text/html" />`,
    `  <icon>${escapeXml(FEED_ICON)}</icon>`,
    `  <logo>${escapeXml(FEED_LOGO)}</logo>`,
    entriesXml,
    `</feed>`,
    ``,
  ].join("\n");

  await fs.writeFile(OUTPUT_RSS_PATH, feedXml, "utf8");
  console.log(
    `Generated ${path.relative(
      PROJECT_ROOT,
      OUTPUT_RSS_PATH
    )} from changelog.json + blog-posts.json`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
