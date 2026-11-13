/**
 * Validation and conversion of the feed inputs `src/data/changelog.json` and
 * `src/data/blog-posts.json`, shared by `generate-rss.mjs` and its unit tests.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { ENTRY_TYPES } from "./changelog-format.mjs";

export { versionId } from "./changelog-format.mjs";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertString(value, valuePath) {
  assert(typeof value === "string", `Expected string at ${valuePath}, got ${typeof value}`);
}

function assertOptionalArray(value, valuePath) {
  if (value === undefined) return;
  assert(Array.isArray(value), `Expected array at ${valuePath}, got ${typeof value}`);
}

function assertOptionalBoolean(value, valuePath) {
  if (value === undefined) return;
  assert(typeof value === "boolean", `Expected boolean at ${valuePath}, got ${typeof value}`);
}

function isHttpsUrl(value) {
  // Only absolute URLs parse without a base, so "//host" and relative paths fail as well.
  return URL.canParse(value) && new URL(value).protocol === "https:";
}

// Labels are escaped on render; these characters are rejected as defense in depth.
function assertLinkLabel(value, valuePath) {
  assertString(value, valuePath);
  assert(!/[<>"]/.test(value), `Invalid character (<, > or ") at ${valuePath}: "${value}"`);
}

function assertHttpsUrl(value, valuePath) {
  assertString(value, valuePath);
  assert(isHttpsUrl(value), `Expected https URL at ${valuePath}: "${value}"`);
}

export function validateChangelogDocument(doc, filePath) {
  assert(isPlainObject(doc), `Invalid changelog JSON: expected object at ${filePath}`);
  assert(
    Array.isArray(doc.releases),
    `Invalid changelog JSON: expected "releases" array at ${filePath}`
  );

  doc.releases.forEach((r, i) => {
    const base = `changelog.releases[${i}]`;
    assert(isPlainObject(r), `Expected object at ${base}`);

    assertString(r.version, `${base}.version`);
    changelogDateToRfc3339(r.date, `${base}.date`);
    assertOptionalBoolean(r.isLatest, `${base}.isLatest`);

    assert(Array.isArray(r.entries), `Expected array at ${base}.entries`);
    r.entries.forEach((e, j) => {
      const ep = `${base}.entries[${j}]`;
      assert(isPlainObject(e), `Expected object at ${ep}`);

      assert(ENTRY_TYPES.includes(e.type), `Unknown entry type at ${ep}.type: "${e.type}"`);
      assertString(e.content, `${ep}.content`);
      if (e.scope !== undefined) assertString(e.scope, `${ep}.scope`);
      assertOptionalArray(e.links, `${ep}.links`);

      if (Array.isArray(e.links)) {
        e.links.forEach((l, k) => {
          const lp = `${ep}.links[${k}]`;
          assert(isPlainObject(l), `Expected object at ${lp}`);
          assertLinkLabel(l.label, `${lp}.label`);
          assertHttpsUrl(l.url, `${lp}.url`);
        });
      }
    });
  });
}

export function validateBlogPostsDocument(doc, filePath, postViewsDir) {
  assert(isPlainObject(doc), `Invalid blog-posts JSON: expected object at ${filePath}`);
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
    assertString(p.component, `${base}.component`);

    // The router builds the blog routes from this file and skips posts whose component is missing.
    const componentPath = path.join(postViewsDir, `${p.component}.vue`);
    assert(
      existsSync(componentPath),
      `Missing component at ${base}.component: ${path.relative(process.cwd(), componentPath)}`
    );

    const parsed = Date.parse(p.published);
    assert(
      Number.isFinite(parsed),
      `Invalid RFC3339 datetime at ${base}.published: "${p.published}"`
    );
  });
}

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Converts a changelog date ("2025-12-29") into an RFC3339 timestamp at noon UTC,
 * so consumers that convert time zones stay on the same day.
 * Throws on anything but a valid calendar date in exactly that format.
 */
export function changelogDateToRfc3339(value, valuePath) {
  const error = new Error(`Invalid ISO date (expected YYYY-MM-DD) at ${valuePath}: "${value}"`);
  const match = ISO_DATE_RE.exec(typeof value === "string" ? value : "");
  if (!match) throw error;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  // Date.UTC rolls over invalid days (2026-02-30 becomes March 2), which the round trip detects.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw error;
  }
  return date.toISOString();
}

/**
 * Groups entries by type in the order of the changelog page; the build validated the types.
 * @param {{ type: string }[]} entries
 * @returns {[string, { type: string }[]][]}
 */
export function groupEntriesByType(entries) {
  return ENTRY_TYPES.map((type) => [type, entries.filter((e) => e.type === type)]).filter(
    ([, group]) => group.length > 0
  );
}
